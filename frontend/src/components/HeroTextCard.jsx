import heroBg from "../assets/mariakray-electronics-6801339_1920.jpg";

const HeroTextCard = () => {
  return (
    <div className="relative flex-1 flex flex-col justify-center px-8 py-10 rounded-3xl overflow-hidden min-h-[320px] w-250">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-30/50 via-teal-30/60 to-white/90"></div>

      <div className="relative z-10">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-white border border-emerald-200 rounded-full px-3 py-1 w-fit mb-4">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Verified Tech Hardware & Enterprise Solutions in Accra
        </span>

        <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
          High-Performance
          <br />
          Hardware.
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
            Zero Compromise.
          </span>
        </h1>

        <p className="text-gray-600 mt-4 text-sm leading-relaxed max-w-md">
          From executive flagship ultrabooks to complete creative studio rigs
          and high-capacity portable power, Phil's-IT equips Ghana's
          forward-thinking builders.
        </p>
      </div>
    </div>
  );
};

export default HeroTextCard;
