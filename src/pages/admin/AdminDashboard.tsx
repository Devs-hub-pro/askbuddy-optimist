import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, RefreshCcw, Save } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIsAdmin } from '@/hooks/useHotTopics';
import { useToast } from '@/hooks/use-toast';
import {
  useApplyModerationAction,
  useAdminDashboard,
  useAdminConfirmRechargeOrder,
  useAppConfigs,
  useContentReports,
  usePendingRechargeOrders,
  useReviewContentReport,
  useUpsertAppConfig,
} from '@/hooks/useAdmin';
import { navigateBackOr } from '@/utils/navigation';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminChecking } = useIsAdmin();
  const { toast } = useToast();
  const { data: dashboard, isLoading: dashboardLoading } = useAdminDashboard();
  const { data: reports, isLoading: reportsLoading } = useContentReports();
  const { data: pendingRechargeOrders, isLoading: pendingOrdersLoading } = usePendingRechargeOrders();
  const { data: configs, isLoading: configsLoading } = useAppConfigs();
  const reviewReport = useReviewContentReport();
  const applyModerationAction = useApplyModerationAction();
  const confirmRechargeOrder = useAdminConfirmRechargeOrder();
  const upsertConfig = useUpsertAppConfig();

  const [selectedConfigKey, setSelectedConfigKey] = useState('search');
  const selectedConfig = useMemo(
    () => configs?.find((item) => item.key === selectedConfigKey) || null,
    [configs, selectedConfigKey]
  );
  const [configJson, setConfigJson] = useState('');

  useEffect(() => {
    if (selectedConfig) {
      setConfigJson(JSON.stringify(selectedConfig.value, null, 2));
    }
  }, [selectedConfig]);

  if (adminChecking || dashboardLoading || reportsLoading || pendingOrdersLoading || configsLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-muted p-6 flex flex-col items-center justify-center text-center">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold mb-2">无管理权限</h1>
        <p className="text-sm text-muted-foreground mb-6">当前账号不是管理员，无法访问运营后台。</p>
        <Button onClick={() => navigateBackOr(navigate, '/profile')}>返回</Button>
      </div>
    );
  }

  const handleSaveConfig = () => {
    if (!selectedConfig) {
      return;
    }

    try {
      const parsed = JSON.parse(configJson);
      upsertConfig.mutate({
        key: selectedConfig.key,
        value: parsed,
        description: selectedConfig.description || undefined,
      });
    } catch {
      toast({
        title: '配置格式错误',
        description: '请输入合法的 JSON 配置',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-muted pb-8">
      <div className="sticky top-0 z-10 shadow-sm">
        <div className="bg-app-header text-white" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center gap-3 px-4 py-3">
            <Button variant="ghost" size="icon" onClick={() => navigateBackOr(navigate, '/profile')} className="text-white hover:bg-white/15 hover:text-white">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-base font-semibold">管理后台</h1>
              <p className="text-xs text-white/80">运营配置、举报处理、风控审计</p>
            </div>
          </div>
        </div>
        <div className="h-1 bg-app-header-light" />
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard title="待确认充值" value={dashboard?.pending_recharge_orders || 0} />
          <MetricCard title="待处理举报" value={dashboard?.pending_reports || 0} tone="warning" />
          <MetricCard title="近30天可疑内容" value={dashboard?.flagged_contents || 0} tone="warning" />
          <MetricCard title="今日收入" value={`¥${Number(dashboard?.today_revenue || 0).toFixed(2)}`} />
        </div>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">待确认充值订单</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(pendingRechargeOrders || []).length === 0 && (
              <div className="text-sm text-muted-foreground">暂无待确认充值单</div>
            )}
            {(pendingRechargeOrders || []).map((order) => (
              <div key={order.id} className="rounded-2xl border bg-background p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-sm">
                      {order.user_nickname || '匿名用户'} · {order.amount} 积分
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {order.payment_method || 'unknown'} · 订单号 {order.provider_order_id || order.id}
                    </div>
                  </div>
                  <span className="text-xs rounded-full bg-orange-50 px-2 py-1 text-orange-700">
                    待支付
                  </span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  应收 ¥{Number(order.cash_amount || 0).toFixed(2)}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      confirmRechargeOrder.mutate({
                        orderId: order.id,
                      })
                    }
                  >
                    人工补单确认
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">最新审计事件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(dashboard?.recent_audit_events || []).length === 0 && (
              <div className="text-sm text-muted-foreground">暂无审计记录</div>
            )}
            {(dashboard?.recent_audit_events || []).map((event) => (
              <div key={event.id} className="rounded-2xl border bg-background p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-sm">{event.event_type}</div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(event.created_at), { addSuffix: true, locale: zhCN })}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {event.entity_type || 'system'} {event.severity}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">举报中心</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(reports || []).length === 0 && (
              <div className="text-sm text-muted-foreground">暂无待展示举报</div>
            )}
            {(reports || []).map((report) => (
              <div key={report.id} className="rounded-2xl border bg-background p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-sm">
                      {report.target_type} · {report.reason}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      举报人：{report.reporter_nickname || '匿名用户'}
                    </div>
                  </div>
                  <span className="text-xs rounded-full bg-amber-50 px-2 py-1 text-amber-700">
                    {report.status}
                  </span>
                </div>
                {report.details && (
                  <div className="mt-2 text-sm text-muted-foreground">{report.details}</div>
                )}
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      reviewReport.mutate({
                        reportId: report.id,
                        status: 'reviewing',
                        resolutionNote: '已进入人工复核',
                      })
                    }
                  >
                    标记复核
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      reviewReport.mutate({
                        reportId: report.id,
                        status: 'resolved',
                        resolutionNote: '已处理并记录',
                      })
                    }
                  >
                    处理完成
                  </Button>
                  {report.target_type !== 'profile' && (
                    <Button
                      size="sm"
                      variant={report.target_hidden ? 'outline' : 'destructive'}
                      onClick={() =>
                        applyModerationAction.mutate({
                          targetId: report.target_id,
                          targetType: report.target_type as 'question' | 'answer' | 'discussion' | 'message',
                          action: report.target_hidden ? 'restore' : 'hide',
                          reason: report.target_hidden ? '管理员恢复内容可见性' : '管理员依据举报隐藏内容',
                          reportId: report.id,
                        })
                      }
                    >
                      {report.target_hidden ? '恢复内容' : '隐藏内容'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">运营配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {(configs || []).map((item) => (
                <Button
                  key={item.key}
                  type="button"
                  size="sm"
                  variant={selectedConfigKey === item.key ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedConfigKey(item.key);
                    setConfigJson(JSON.stringify(item.value, null, 2));
                  }}
                >
                  {item.key}
                </Button>
              ))}
            </div>
            {selectedConfig && (
              <>
                <Input value={selectedConfig.key} readOnly />
                <Textarea
                  value={configJson}
                  onChange={(event) => setConfigJson(event.target.value)}
                  rows={8}
                  className="font-mono text-xs"
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertTriangle size={14} />
                  修改后会立即影响搜索、风控、支付等线上配置。
                </div>
                <Button
                  onClick={handleSaveConfig}
                  disabled={upsertConfig.isPending}
                  className="w-full"
                >
                  <Save size={16} className="mr-2" />
                  保存配置
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  tone = 'default',
}: {
  title: string;
  value: number | string;
  tone?: 'default' | 'warning';
}) => (
  <Card className="surface-card rounded-3xl border-none shadow-sm">
    <CardContent className="p-4">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className={tone === 'warning' ? 'mt-2 text-2xl font-bold text-amber-600' : 'mt-2 text-2xl font-bold'}>
        {value}
      </div>
    </CardContent>
  </Card>
);

export default AdminDashboard;
