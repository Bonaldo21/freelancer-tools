import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export default function PageHeader({ icon: Icon, title, description, gradient }: PageHeaderProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} px-6 py-12 text-white`}>
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg flex-shrink-0">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black">{title}</h1>
          <p className="text-white/70 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
