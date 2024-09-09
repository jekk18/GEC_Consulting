import React from "react";
import BookServiceComponent from "@/components/page-components/book_service/index";
import BusinessAssistantComponent from "@/components/page-components/business_assistant/index";
import CasesComponent from "@/components/page-components/cases/index";
import FaqComponent from "@/components/page-components/faq/index";
import FourPostsComponent from "@/components/page-components/four_posts/index";
import ThreePostsComponent from "@/components/page-components/three_posts/index";
import GraphicBannerComponent from "@/components/page-components/graphic_banner/index";
import GeneralBannerComponent from "@/components/page-components/general_banner/index";
import ImageLeftComponent from "@/components/page-components/image_left/index";
import ImageRightComponent from "@/components/page-components/image_right/index";
import MultimediaSliderComponent from "@/components/page-components/multimedia_slider/index";
import NewsComponent from "@/components/page-components/news/index";
import PartnersComponent from "@/components/page-components/partners/index";
import ProjectsComponent from "@/components/page-components/projects/index";
import PuzzleComponent from "@/components/page-components/puzzle/index";
import ServiceSliderComponent from "@/components/page-components/service_slider/index";
import ServicesComponent from "@/components/page-components/services/index";
import StatisticsBannerComponent from "@/components/page-components/statistics_banner/index";
import TabsComponent from "@/components/page-components/tabs/index";
import TeamComponent from "@/components/page-components/team/index";
import TestimonialComponent from "@/components/page-components/testimonial/index";




const getPageComponents = (componentables, page, isPost) => {
  const componentMapping = {
    "book_service": BookServiceComponent,
    "business_assistant": BusinessAssistantComponent,
    "cases": CasesComponent,
    "faq": FaqComponent,
    "four_posts": FourPostsComponent,
    "three_posts": ThreePostsComponent,
    "graphic_banner": GraphicBannerComponent,
    "general_banner": GeneralBannerComponent,
    "image_left": ImageLeftComponent,
    "image_right": ImageRightComponent,
    "multimedia_slider": MultimediaSliderComponent,
    "news": NewsComponent,    
    "clients": PartnersComponent,
    "projects": ProjectsComponent,
    "puzzle": PuzzleComponent,
    "service_slider": ServiceSliderComponent,
    "services": ServicesComponent,
    "statistic_banner": StatisticsBannerComponent,
    "tabs": TabsComponent,
    "team": TeamComponent,
    "testimionals": TestimonialComponent, 
  };

  componentables?.sort((a, b) => a.sort - b.sort);

  return (
    <>
      {componentables?.length > 0 &&
        componentables.map((item, index) => {
          const Component = componentMapping[item?.component?.type_name];
          return (
            <React.Fragment key={index}>
              {Component ? <Component componentData={item} page={page} isPost={isPost} /> : null}
            </React.Fragment>
          );
        })}
    </>
  );
};

export default getPageComponents;