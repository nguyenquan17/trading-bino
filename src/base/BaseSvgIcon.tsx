import React, { FC, SVGProps, useEffect, useState } from "react";

interface BaseSvgIconProps extends SVGProps<SVGSVGElement> {
  iconName: string;
  size: number;
}

const BaseSvgIcon: FC<BaseSvgIconProps> = ({ iconName, size, ...props }) => {
  const [svgPath, setSvgPath] = useState("");
  useEffect(() => {
    const spath = "/images/icons/" + iconName + ".svg";
    setSvgPath(spath + "#" + iconName);
  }, []);

  return (
    <svg className="svg-item" width={size} height={size}>
      <use xlinkHref={svgPath} />
    </svg>
  );
};

export default BaseSvgIcon;
