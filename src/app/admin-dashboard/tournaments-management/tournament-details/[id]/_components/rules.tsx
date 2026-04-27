import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface RulesProps {
  rules?: string[];
  isLoading: boolean;
}

const Rules = ({ rules, isLoading }: RulesProps) => {

  if (isLoading) {
    return (
      <div>
        <h4 className="text-2xl font-semibold">Event Rules</h4>

        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-2xl font-semibold">Event Rules</h4>

      <div className="text-gray-500 mt-3 space-y-3">
        {rules && rules.length > 0 ? (
          rules.map((rule, index) => (
            <div key={index} dangerouslySetInnerHTML={{ __html: rule }} />
          ))
        ) : (
          <p>No rules defined for this tournament.</p>
        )}
      </div>
    </div>
  );
};

export default Rules;
