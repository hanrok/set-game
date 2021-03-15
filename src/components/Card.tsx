interface ICardProps {
  config: number[];
}

const createImages = (config: number[]) => {
  const [shape, color, n, shading] = config;
  const shapes = [];

  for (let i = 0; i < n; i++) {
    shapes.push(
      <img key={i} alt="shape" src={`/assets/svg/${[shape, color, shading].toString()}.svg`} />
    );
  }

  return shapes;
}

const Card = ({ config }: ICardProps) => {
  return <button className="p-6 bg-gray-200 rounded-sm flex space-x-4 justify-center items-center">
    { createImages(config) }
  </button>;
};

export default Card;
