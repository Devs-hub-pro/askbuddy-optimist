
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const RECHARGE_OPTIONS = [
  { amount: 10, price: '¥1', label: '10积分', popular: false },
  { amount: 50, price: '¥5', label: '50积分', popular: false },
  { amount: 100, price: '¥10', label: '100积分', popular: true },
  { amount: 200, price: '¥20', label: '200积分', popular: false },
  { amount: 500, price: '¥50', label: '500积分', popular: false },
  { amount: 1000, price: '¥100', label: '1000积分', popular: false },
];

const PointsRecharge = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRecharge = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc('recharge_points', {
        p_amount: selected,
        p_payment_method: '模拟支付',
      });

      if (error) throw error;

      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['my-earnings'] });

      toast({ title: '充值成功', description: `已充值 ${selected} 积分` });

      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      toast({ title: '充值失败', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const selectedOption = RECHARGE_OPTIONS.find(o => o.amount === selected);

  return (
    <div className="min-h-screen bg-muted pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background flex items-center p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">积分充值</h1>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-none shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center mb-2">
              <Coins className="mr-2" size={20} />
              <span className="text-sm opacity-80">当前积分余额</span>
            </div>
            <div className="text-3xl font-bold">{profile?.points_balance || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recharge Options */}
      <div className="px-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">选择充值金额</h3>
        <div className="grid grid-cols-3 gap-3">
          {RECHARGE_OPTIONS.map((option) => (
            <button
              key={option.amount}
              className={`relative rounded-xl p-4 text-center transition-all border-2 ${
                selected === option.amount
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-background hover:border-primary/40'
              }`}
              onClick={() => setSelected(option.amount)}
            >
              {option.popular && (
                <span className="absolute -top-2 right-2 bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                  推荐
                </span>
              )}
              <div className={`text-lg font-bold ${selected === option.amount ? 'text-primary' : 'text-foreground'}`}>
                {option.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{option.price}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">支付方式</h3>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">模拟支付</span>
            </div>
            <CheckCircle2 size={20} className="text-primary" />
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground mt-2">* 当前为演示模式，充值将直接到账</p>
      </div>

      {/* Submit Button */}
      <div className="px-4 mt-8">
        <Button
          className="w-full h-12 text-base font-semibold rounded-xl shadow-lg"
          onClick={handleRecharge}
          disabled={loading || success}
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : success ? (
            <CheckCircle2 className="mr-2" size={18} />
          ) : null}
          {success ? '充值成功！' : `确认充值 ${selectedOption?.price} → ${selected}积分`}
        </Button>
      </div>
    </div>
  );
};

export default PointsRecharge;
