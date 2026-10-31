
const FeatureCard = ({ title, children }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-2 text-xl font-normal">{title}</h3>
      <p className="text-[15px] leading-relaxed text-gray-500">
        {children}
      </p>
    </div>
  );
};

export default FeatureCard;
