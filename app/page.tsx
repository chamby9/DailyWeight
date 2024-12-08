export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">
                  DailyWeight
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/auth/login"
                className="text-neutral hover:text-primary transition-colors"
              >
                Sign in
              </a>
              <a
                href="/auth/signup"
                className="bg-primary hover:bg-primary-focus text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Track Your Weight Journey
            <br />
            with
            <div className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
              Precision & Insight
            </div>
          </h1>
          <p className="mt-6 text-xl text-neutral/70 leading-relaxed">
            Simple, effective weight tracking powered by AI insights to help you stay motivated and reach your fitness goals.
          </p>
          <div className="mt-10">
            <a
              href="/auth/signup"
              className="bg-primary hover:bg-primary-focus text-white px-12 py-4 rounded-lg transition-colors text-lg font-medium inline-block"
            >
              Start Your Journey
            </a>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Smart Tracking",
              description: "Effortlessly log your weight and see your progress visualized through intuitive charts.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )
            },
            {
              title: "AI Insights",
              description: "Get personalized insights and recommendations based on your weight tracking patterns.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )
            },
            {
              title: "Goal Setting",
              description: "Set and track your weight goals with visual progress indicators and milestone celebrations.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            }
          ].map((feature, index) => (
            <div key={index} className="card bg-card-dark text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="card-body">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="card-title text-white">{feature.title}</h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}