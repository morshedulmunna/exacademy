import React from "react";
import { RatingView } from "../RatingView";
import Avatar from "../Avatar";

type Props = object;

export default function ReviewCard({}: Props) {
  return (
    <>
      <div className="mt-6 flex gap-4 justify-start items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
        <Avatar link="https://www.shutterstock.com/image-vector/vector-illustration-avatar-dummy-sign-260nw-1290549613.jpg" />
        <div className="flex-1">
          <h5 className="dark:text-white text-gray-900 font-medium mb-2">Shanto Mahbub</h5>
          <div className="flex gap-2 items-center my-2 justify-start">
            <RatingView ratingPercentage={90} />
            <p className="text-sm dark:text-gray-400 text-gray-500">Oct 05, 2024</p>
          </div>
          <p className="text-sm dark:text-gray-300 text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium in suscipit aliquam voluptates a illum, nesciunt odio veritatis architecto optio tempora perferendis nulla numquam similique sunt eius atque? Suscipit, nemo. Reiciendis dolor, sint maiores ipsa
            architecto ipsam deleniti excepturi facilis.{" "}
          </p>
        </div>
      </div>
    </>
  );
}
