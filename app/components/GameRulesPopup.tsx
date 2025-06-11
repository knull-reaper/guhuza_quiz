import React from 'react';

interface GameRulesPopupProps {
  onClose: () => void;
}

const GameRulesPopup: React.FC<GameRulesPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-lg flex items-center justify-center z-50 p-4"> {/* Added backdrop-blur-lg, kept bg-opacity-75 */}
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full text-gray-800 border border-gray-200 transform transition-all duration-300 ease-out scale-95 hover:scale-100">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-2 text-purple-700">Welcome to Guhuza Quiz!</h2>
          <p className="text-lg text-purple-500">Get ready to test your knowledge!</p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-3 text-indigo-600">Game Rules</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Each quiz consists of multiple-choice questions.</li>
            <li>You have a limited time to answer each question.</li>
            <li>Read each question carefully before selecting an answer.</li>
            <li>Progress through levels by achieving target scores.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-3 text-indigo-600">Scoring System</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong className="text-green-600">Correct Answer:</strong> +10 points.</li>
            <li><strong className="text-green-600">Speed Bonus:</strong> Up to +5 extra points for answering quickly.</li>
            <li><strong className="text-red-600">Incorrect Answer:</strong> No points deducted, but aim for accuracy!</li>
            <li>Complete quizzes to earn XP and climb the leaderboard.</li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameRulesPopup;
