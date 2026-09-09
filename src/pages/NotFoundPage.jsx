import React from 'react';
import { NavLink } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { HelpCircle, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="py-12">
      <EmptyState
        icon={<HelpCircle className="w-8 h-8 text-amber-500" />}
        title="Page Not Found"
        description="The view or route you requested could not be located."
        action={
          <NavLink to="/">
            <Button variant="primary" size="sm" leftIcon={<Home className="w-4 h-4" />}>
              Back to Dashboard
            </Button>
          </NavLink>
        }
      />
    </div>
  );
}
