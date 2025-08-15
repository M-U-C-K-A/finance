import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Reports - FinAnalytics',
    template: '%s - FinAnalytics'
  },
  description: 'Generate, view, and manage your financial analysis reports.',
};

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}