import { Sun, Cloud, CloudRain, CloudFog, CloudLightning, CloudSnow } from 'lucide-react';

interface WeatherIconProps {
  description: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ description }) => {
  // 根据天气描述返回对应图标
  const getIcon = () => {
    if (description.includes('晴')) {
      return <Sun className="h-6 w-6 text-yellow-500" />;
    } else if (description.includes('云') || description.includes('阴')) {
      return <Cloud className="h-6 w-6 text-gray-500" />;
    } else if (description.includes('雨')) {
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    } else if (description.includes('雾')) {
      return <CloudFog className="h-6 w-6 text-gray-400" />;
    } else if (description.includes('雷')) {
      return <CloudLightning className="h-6 w-6 text-yellow-600" />;
    } else if (description.includes('雪')) {
      return <CloudSnow className="h-6 w-6 text-blue-200" />;
    }
    return <Sun className="h-6 w-6 text-yellow-500" />;
  };

  return getIcon();
}; 