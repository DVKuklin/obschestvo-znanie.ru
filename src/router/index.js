import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SectionMenu from '../views/SectionMenu.vue'
import Theme from '../views/Theme.vue'
import AdditionalPage from '../views/AdditionalPage.vue'
import NotFound from '../views/NotFound.vue'
import { getSections, getThemesAndSectionBySectionUrl, getAdditionalPagesUrl } from '../services/methods.js';
import store from '../store';

let routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/favourites',
    name: 'Favourites',
    component: () => import('../views/Favourites.vue')
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})



async function addRoutes() {
  routes=[];
  let sectionRoutes;
  let sections = await getSections();
  sectionRoutes = sections.data.map(function(item,index){
    return {
      path: '/'+item.url+'/',
      component: SectionMenu
    }
  });

  // Добавляем руты для меню разделов 
  for (let i = 0;i<sectionRoutes.length;i++) {
    routes.push(sectionRoutes[i]);
  }

  // Роуты для тем
  for (let i = 0;i<sections.data.length;i++) {
    let tempThems = await getThemesAndSectionBySectionUrl(sections.data[i].url);

    for (let j=0; j<tempThems.data.themes.length;j++) {
      routes.push({
        path: '/'+sections.data[i].url+'/'+tempThems.data.themes[j].url+'/',
        component: Theme,
        meta: {isTheme: true}
      })
    }
  }

  //Роуты для дополнительных страниц
  let additionalPages = await getAdditionalPagesUrl();
  store.commit('appState/setAdditionalPages',additionalPages.data);
  additionalPages.data.forEach(element => {
    routes.push({
      path: '/'+element.url,
      component: AdditionalPage,
    })
  });

  for (let i=0;i<routes.length;i++) {
    router.addRoute(routes[i]);
  }
  router.addRoute(
    //Редирект на несуществующие страницы
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    }
  );
  //Редирект на несуществующие страницы дополнение
  router.resolve({
    name: 'not-found',
    params: { pathMatch: ['not', 'found'] },
  }).href
  router.replace(router.currentRoute.value.fullPath);

}

addRoutes();


export default router;