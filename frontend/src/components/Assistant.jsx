import React from "react";

const Assistant = () => {
  return (
    <div className="fixed bottom-4 left-4 flex items-end gap-2 animate-bounce">
      <div className="text-4xl">🤖</div>
      <div className="bg-white p-2 rounded-lg shadow-lg text-sm">
        Hi! I’m your OfficeEase guide. I’ll help you explore this app 👋
      </div>
    </div>
  );
};

export default Assistant;
