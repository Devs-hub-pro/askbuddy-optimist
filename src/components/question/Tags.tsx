
import React from "react";
interface TagsProps {
  tags: string[];
}

const Tags: React.FC<TagsProps> = ({ tags }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {tags.map((tag, i) => (
      <span
        key={i}
        className="bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full border border-border"
      >
        #{tag}
      </span>
    ))}
  </div>
);

export default Tags;
