import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigateBackOr } from "@/utils/navigation";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 px-5">
      <div className="surface-card w-full max-w-sm rounded-3xl p-6 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertCircle size={28} />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">页面不存在</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          你访问的页面可能已被移除，或当前链接已失效。
        </p>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-full" onClick={() => navigateBackOr(navigate, "/")}>
            返回上页
          </Button>
          <Button className="flex-1 rounded-full" onClick={() => navigate("/")}>
            回到首页
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
