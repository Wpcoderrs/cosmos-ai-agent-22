
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from './hooks/useSettingsForm';

interface WebhookFieldProps {
  form: UseFormReturn<SettingsFormValues>;
  name: keyof SettingsFormValues;
  label: string;
  description: string;
  placeholder?: string;
}

const WebhookField: React.FC<WebhookFieldProps> = ({
  form,
  name,
  label,
  description,
  placeholder = "https://your-webhook-url.com"
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-3">
          <FormLabel className="text-[#33C3F0] font-space-grotesk text-sm">{label}</FormLabel>
          <FormControl>
            <Input 
              placeholder={placeholder} 
              {...field} 
              className="bg-[#0c1f31] border-[#33C3F0]/40 focus:border-[#33C3F0] transition-colors h-9"
            />
          </FormControl>
          <FormDescription className="text-gray-400 text-xs font-inter mt-1">
            {description}
          </FormDescription>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default WebhookField;
