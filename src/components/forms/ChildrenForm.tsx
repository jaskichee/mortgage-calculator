import React from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { childrenSchema, ChildrenFormData } from '@/lib/schemas/children-schema';
import DesktopDatePicker from '@/components/ui/DesktopDatePicker';
import { Button } from '@/components/ui/Button';
import { calculateAge, getChildCost } from '@/lib/calculations/age-calculator';

interface ChildrenFormProps {
  defaultValues?: Partial<ChildrenFormData>;
  onSubmit: (data: ChildrenFormData) => void;
  onBack: () => void;
}

export function ChildrenForm({ defaultValues, onSubmit, onBack }: ChildrenFormProps) {
  const {
    control,
    handleSubmit,
  } = useForm<ChildrenFormData>({
    resolver: zodResolver(childrenSchema),
    defaultValues: {
      children: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  const children = useWatch({
    control,
    name: "children",
  });

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
              <div className="flex-1 w-full min-w-0">
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
