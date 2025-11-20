import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { childrenSchema, ChildrenFormData } from '@/lib/schemas/children-schema';
import { Input } from '@/components/ui/Input';
import DesktopDatePicker from '@/components/ui/DesktopDatePicker';
import { Button } from '@/components/ui/Button';
import { calculateAge, getChildCost } from '@/lib/calculations/age-calculator';

interface ChildrenFormProps {
  defaultValues?: Partial<ChildrenFormData>;
  onSubmit: (data: ChildrenFormData) => void;
  onBack: () => void;
}

function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}. ${m}. ${y}`;
}

function parseDate(str: string): Date | undefined {
  const parts = str.split(/[. ]+/).filter(Boolean);
  if (parts.length !== 3) return undefined;
  const d = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const y = parseInt(parts[2], 10);
  
  if (isNaN(d) || isNaN(m) || isNaN(y)) return undefined;
  
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return undefined;
  
  return date;
}

const DateInput = ({ value, onChange, error, label }: { value: Date | undefined, onChange: (d: Date | undefined) => void, error?: string, label: string }) => {
  // For better mobile UX use native date input (YYYY-MM-DD). We keep the shared `Input` for styling.
  const toInputValue = (d?: Date) => (d ? d.toISOString().slice(0, 10) : '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    if (!val) return onChange(undefined);
    const parts = val.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return onChange(undefined);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    onChange(date);
  };

  return (
    <Input
      clearOnFocus
      label={label}
      type="date"
      value={toInputValue(value)}
      onChange={handleChange}
      error={error}
    />
  );
};

export function ChildrenForm({ defaultValues, onSubmit, onBack }: ChildrenFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChildrenFormData>({
    resolver: zodResolver(childrenSchema) as any,
    defaultValues: {
      children: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  const children = watch('children');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-foreground">Children</h3>
          <Button 
            type="button" 
            variant="secondary" 
            size="sm"
            onClick={() => append({ birthDate: new Date() })}
          >
            Add Child
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-muted-foreground text-sm italic">No children added yet.</p>
        )}

        {fields.map((field, index) => {
          const birthDate = children?.[index]?.birthDate;
          const age = birthDate ? calculateAge(new Date(birthDate)) : 0;
          const cost = getChildCost(age);

          return (
            <div key={field.id} className="flex flex-col sm:flex-row gap-4 sm:items-end p-4 border border-border rounded-md bg-muted/20">
              <div className="flex-1 w-full sm:min-w-0">
                <Controller
                  control={control}
                  name={`children.${index}.birthDate`}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <DesktopDatePicker
                      label={`Child ${index + 1} Date of Birth`}
                      value={value}
                      onChange={onChange}
                      error={error?.message}
                    />
                  )}
                />
              </div>
              <div className="text-sm text-muted-foreground sm:pb-3">
                Age: {age} | Est. Cost: €{cost}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full sm:w-auto text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-full">Back</Button>
        <Button type="submit" className="w-full">Next Step</Button>
      </div>
    </form>
  );
}
