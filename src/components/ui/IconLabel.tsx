import React from "react";

type ContactInfoItemProps = {
  icon: React.ReactNode;
  text?: string;
  className?: string;
};

export function IconLabel({ icon, text, className }: ContactInfoItemProps) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      {text && <span className={className}>{text}</span>}
    </div>
  );
}