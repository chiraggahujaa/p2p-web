import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/ui';
import { getConditionConfig, type ItemCondition, type FormCondition } from '@/lib/constants/conditions';

interface ItemConditionTagProps {
  condition: ItemCondition | FormCondition;
  variant?: 'default' | 'outline';
  className?: string;
}

export function ItemConditionTag({
  condition,
  variant = 'outline',
  className
}: ItemConditionTagProps) {
  const config = getConditionConfig(condition);

  return (
    <Badge
      variant={variant}
      className={cn(
        'border',
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}