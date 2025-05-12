import { createRouter, createWebHistory } from 'vue-router'
import StepperForm from './components/StepperForm.vue'
import FichaList from './components/FichaList.vue'
import FichaDetalle from './components/FichaDetalle.vue'
import FichaEditar from './components/FichaEditar.vue'

const routes = [
  {
    path: '/',
    name: 'Formulario',
    component: StepperForm
  },
  {
    path: '/fichas',
    name: 'ListadoFichas',
    component: FichaList
  },
  {
    path: '/ficha/:id',
    name: 'DetalleFicha',
    component: FichaDetalle,
    props: true
  },
  {
    path: '/ficha/editar/:id',
    name: 'EditarFicha',
    component: FichaEditar,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ⚠️ Proteger navegación si se está editando
router.beforeEach((to, from, next) => {
  const modoEdicionActiva = sessionStorage.getItem('modoEdicionActiva')
  const bloqueadas = ['/', '/fichas']

  if (modoEdicionActiva && bloqueadas.includes(to.path)) {
    alert('Debes guardar o cancelar la edición antes de salir.')
    return next(false)
  }

  next()
})

export default router
