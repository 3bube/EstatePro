type WelcomeSectionProps = {
  userName: string;
};

export function WelcomeSection({ userName }: WelcomeSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-[#2C3E50]">
        Welcome back, {userName || 'Guest'}!
      </h1>
      <p className="text-gray-600 mt-2">
        Here&apos;s what&apos;s happening with your real estate journey today.
      </p>
    </div>
  );
}
