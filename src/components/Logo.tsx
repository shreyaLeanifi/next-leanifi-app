import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/leanifi-logo.png"
        alt="Leanifi Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  );
}

