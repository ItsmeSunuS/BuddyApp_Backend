exports.calculateBMI = (weight, height) => {
  return weight / (height * height);
};

exports.weightLossFromCalories = (calories) => {
  return calories / 7700;
};

exports.estimateDaysToTarget = (currentWeight, targetWeight, avgDailyCalories) => {
  const weightToLose = currentWeight - targetWeight;
  if (avgDailyCalories <= 0) return 0;

  const caloriesNeeded = weightToLose * 7700;
  return Math.ceil(caloriesNeeded / avgDailyCalories);
};