import { Link } from 'react-router-dom';
import { FaGift, FaUsers, FaHistory } from 'react-icons/fa';

export default function Dashboard() {
  const features = [
    {
      title: 'Create a Room',
      description: 'Start a new Secret Santa exchange',
      icon: <FaGift className="feature-icon" />,
      to: '/create',
      color: 'var(--christmas-red)'
    },
    {
      title: 'Join a Room',
      description: 'Join an existing room with a code',
      icon: <FaUsers className="feature-icon" />,
      to: '/join',
      color: 'var(--christmas-green)'
    },
    {
      title: 'Memories',
      description: 'View past Secret Santa events',
      icon: <FaHistory className="feature-icon" />,
      to: '/memories',
      color: 'var(--christmas-gold)'
    }
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="animate-float">🎅 Secret Santa Magic 🎄</h1>
          <p className="text-xl text-snow/80 max-w-2xl mx-auto">
            Create unforgettable holiday memories with our magical Secret Santa experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link 
              to={feature.to} 
              key={feature.title}
              className="feature-card"
              style={{ '--accent-color': feature.color }}
            >
              <div className="feature-icon-wrapper" style={{ backgroundColor: feature.color + '20' }}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-snow/70">{feature.description}</p>
              <div className="feature-ornament"></div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block p-6 glass-card">
            <h2 className="text-2xl mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                '1. Create or join a room',
                '2. Invite your friends',
                '3. Start the gift exchange!'
              ].map((step, index) => (
                <div key={index} className="flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-christmas-red flex items-center justify-center text-white font-bold mr-3">
                    {index + 1}
                  </div>
                  <span className="text-lg">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/create" className="option-card">
            <div className="option-content">
              <div className="icon-circle">🎁</div>
              <h2>Create Room</h2>
              <p>Start a Secret Santa session with your squad</p>
            </div>
          </Link>

          <Link to="/join" className="option-card">
            <div className="option-content">
              <div className="icon-circle">🎄</div>
              <h2>Join Room</h2>
              <p>Enter a room code to jump in</p>
            </div>
          </Link>

          <Link to="/memories" className="option-card">
            <div className="option-content">
              <div className="icon-circle">💖</div>
              <h2>Memories</h2>
              <p>Relive past gifts, photos & the moments</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
