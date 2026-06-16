const ReviewCard = ({
  client,
  rating,
  comment,
  date,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6">

      <div className="flex justify-between items-center">

        <h3 className="font-bold text-lg">
          {client}
        </h3>

        <span className="font-semibold">
          ⭐ {rating}
        </span>

      </div>

      <p className="text-gray-600 mt-4">
        {comment}
      </p>

      <p className="text-sm text-gray-400 mt-4">
        {date}
      </p>

    </div>
  );
};

export default ReviewCard;