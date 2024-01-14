document.addEventListener("DOMContentLoaded", () => {
  // Simulated leaderboard data (replace with your actual data)
  const leaderboardData = [
    { name: "User1", points: 100 },
    { name: "User2", points: 85 },
    { name: "User3", points: 72 },
    // Add more user data as needed
  ];

  // Select the <ol> element in the leaderboard
  const leaderboardList = document.querySelector(".leaderboard ol");

  // Populate the leaderboard with user data
  leaderboardData.forEach((user, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${user.name} - ${user.points} points`;
    leaderboardList.appendChild(listItem);
  });
});