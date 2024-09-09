import Link from "next/link";

const BannerItem = ({ bannerTitle, bannerUrl, bannerImg }) => {  
  return (
    <Link
    target="blank"
      href={bannerUrl}
      style={{ pointerEvents: bannerUrl ? "initial" : "none" }}
    >
      <div className="banner-bacgkround-image">
        <h2>{bannerTitle}</h2>
        {bannerImg ? (
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${bannerImg?.file}`}
            alt={bannerImg?.alt}
            loading="lazy"
          />
        ) : (
          <img src="/img/b1.png" loading="lazy" />
        )}
      </div>
    </Link>
  );
};

export default BannerItem;
