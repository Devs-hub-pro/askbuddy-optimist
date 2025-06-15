
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TimeSlot {
  id: string;
  label: string;
}
export interface AnswerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  askerTimeSlots: TimeSlot[];
  onSubmit: (payload: { timeSlots: string[]; message: string }) => void;
}

const availableWeekSlots: TimeSlot[] = [
  { id: "weeknight", label: "工作日晚 19:00-22:00" },
  { id: "weekend", label: "周末全天" },
  { id: "custom", label: "自定义时间" }
];

export const AnswerDialog: React.FC<AnswerDialogProps> = ({
  open,
  onOpenChange,
  askerTimeSlots,
  onSubmit
}) => {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [customSlot, setCustomSlot] = useState("");
  const [message, setMessage] = useState("");

  const handleSlotChange = (slotId: string) => {
    if (slotId === "custom") return;
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleSubmit = () => {
    let slots = selectedSlots;
    if (customSlot.trim()) {
      slots = [...slots, customSlot.trim()];
    }
    onSubmit({ timeSlots: slots, message });
    setSelectedSlots([]);
    setCustomSlot("");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[420px] animate-fade-in space-y-6">
        <DialogHeader>
          <DialogTitle className="text-left text-base font-bold">我来回答</DialogTitle>
          <DialogDescription className="text-gray-500 text-xs text-left">
            查看提问者偏好时间段，填写你的可回答时间，为提问者留言，提高彼此匹配度。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* 提问者偏好时间段 */}
          <div>
            <div className="text-xs text-gray-600 mb-1">提问者偏好时间段</div>
            <div className="flex flex-wrap gap-2">
              {askerTimeSlots.map((slot) => (
                <span
                  key={slot.id}
                  className="bg-blue-50 text-blue-600 border border-blue-100 text-xs px-2.5 py-1 rounded-full"
                >
                  {slot.label}
                </span>
              ))}
            </div>
          </div>

          {/* 回答者可选时间段 */}
          <div>
            <div className="text-xs text-gray-600 mb-1">你的可回答时间段<span className="text-red-400">*</span></div>
            <div className="flex flex-wrap gap-2">
              {availableWeekSlots.map((slot) =>
                slot.id !== "custom" ? (
                  <div
                    key={slot.id}
                    onClick={() => handleSlotChange(slot.id)}
                    className={`border rounded-lg px-2 py-1 text-xs cursor-pointer transition-all ${
                      selectedSlots.includes(slot.id)
                        ? "border-app-teal bg-blue-50 text-app-teal shadow"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    {slot.label}
                  </div>
                ) : null
              )}
              {/* 自定义 */}
              <input
                value={customSlot}
                onChange={(e) => setCustomSlot(e.target.value)}
                placeholder="其它时间段请填写"
                className="border border-gray-200 bg-white rounded px-2 py-1 text-xs w-32"
                maxLength={16}
              />
            </div>
            <div className="text-[11px] text-gray-400 mt-1">可多选，如无匹配请填写自定义</div>
          </div>

          {/* 留言 */}
          <div>
            <div className="text-xs text-gray-600 mb-1">给TA留言（选填）</div>
            <Textarea
              placeholder="可以介绍你的擅长领域、期望沟通方式等"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">取消</Button>
          </DialogClose>
          <Button
            className="bg-gradient-to-r from-blue-500 to-app-blue"
            disabled={selectedSlots.length === 0 && !customSlot.trim()}
            onClick={handleSubmit}
          >
            提交
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnswerDialog;
