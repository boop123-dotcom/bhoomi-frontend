const GoalCard = ({ title, status }) => (
    <div className="border rounded-lg p-3 my-3 shadow">
      <h3 className="font-semibold">{title}</h3>
      <p>Status: {status}</p>
    </div>
  );
  export default GoalCard;
  