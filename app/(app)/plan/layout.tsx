import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Plans & Billing - FinAnalytics',
    template: '%s - FinAnalytics'
  },
  description: 'Manage your subscription, billing, and credits for FinAnalytics platform.',
};

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}