<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 6 Estado Técnico y Datos Complementarios</h2>

    <!-- Estado Técnico -->
    <div class="mb-8 p-4 border rounded bg-gray-50 shadow-sm">
      <h3 class="text-lg font-semibold mb-4 border-b pb-1">Estado Técnico</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block mb-1 font-medium">Fecha Licencia Inicial</label>
          <input v-model="localData.fechaLicenciaInicial" type="date" class="w-full p-2 border rounded" />
        </div>

        <div>
          <label class="block mb-1 font-medium">Fecha Modificación</label>
          <input v-model="localData.fechaModificacion" type="date" class="w-full p-2 border rounded" />
        </div>

        <div class="md:col-span-2">
          <label class="block mb-1 font-medium">Descripción de estado de licencia y/o modificación</label>
          <textarea v-model="localData.descripcionEstadoLicencia" rows="4" class="w-full p-2 border rounded"></textarea>

          <input
            v-if="!localData.documentoEstadoTecnicoUrl"
            type="file"
            accept="application/pdf"
            @change="handleArchivoEstadoTecnico"
            class="mt-2"
          />

          <div v-if="localData.documentoEstadoTecnicoUrl" class="mt-4 bg-gray-100 p-3 rounded shadow text-sm text-black">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <a
                  :href="localData.documentoEstadoTecnicoUrl"
                  target="_blank"
                  class="text-black font-medium underline hover:text-gray-700"
                >
                  Ver documento cargado
                </a>
              </div>
              <div class="flex items-center gap-4">
                <button
                  class="text-sm text-gray-600 hover:text-black font-semibold underline"
                  @click="triggerInputEstadoTecnico"
                >
                  Reemplazar documento
                </button>
                <button
                  class="text-sm text-red-600 hover:text-red-800 font-semibold underline"
                  @click="eliminarArchivoEstadoTecnico"
                >
                  Eliminar documento
                </button>
              </div>
            </div>
            <input
              ref="inputArchivoEstadoTecnico"
              type="file"
              accept="application/pdf"
              class="hidden"
              @change="handleArchivoEstadoTecnico"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Datos Complementarios -->
    <div class="p-4 border rounded bg-gray-50 shadow-sm">
      <h3 class="text-lg font-semibold mb-4 border-b pb-1">Datos Complementarios</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block mb-1 font-medium">Latitud</label>
          <input v-model="localData.latitud" type="text" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="block mb-1 font-medium">Longitud</label>
          <input v-model="localData.longitud" type="text" class="w-full p-2 border rounded" />
        </div>
      </div>

      <!-- Nombres antiguos -->
      <div class="mb-6">
        <h4 class="text-md font-semibold mb-2">Historial de Nombres Antiguos</h4>
        <div
          v-for="(nombre, index) in localData.nombresAntiguos"
          :key="index"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center"
        >
          <input v-model="nombre.nombre" type="text" placeholder="Nombre Antiguo" class="p-2 border rounded" />
          <input v-model="nombre.anioHasta" type="number" placeholder="Año Hasta" class="p-2 border rounded" />
          <button
            @click="eliminarNombreAntiguo(index)"
            class="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-800"
          >
            🗑 Eliminar
          </button>
        </div>
        <button
          @click="agregarNombreAntiguo"
          class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          + Agregar Nombre Antiguo
        </button>
      </div>

      <!-- Imágenes -->
      <div>
        <h4 class="text-md font-semibold mb-2">Imágenes del Predio</h4>
        <input type="file" accept="image/*" multiple @change="handleImagenes" class="mb-4" />

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="(img, index) in localData.imagenes" :key="index" class="relative group">
            <img :src="img" class="w-full h-32 object-cover rounded border" />
            <button
              @click="eliminarImagen(index)"
              class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase/config'

export default {
  name: 'PasoTecnicoComplementarios',
  props: ['modelValue'],
  emits: ['update:modelValue', 'archivoTemporal', 'archivoEliminado'],
  computed: {
    localData: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    triggerInputEstadoTecnico() {
      this.$refs.inputArchivoEstadoTecnico.click()
    },
    eliminarArchivoEstadoTecnico() {
      if (!this.localData.documentoEstadoTecnicoUrl) return
      const confirmar = confirm('¿Deseas eliminar el documento técnico cargado?')
      if (!confirmar) return
      this.$emit('archivoEliminado', this.localData.documentoEstadoTecnicoUrl)
      this.localData.documentoEstadoTecnicoUrl = ''
      this.$refs.inputArchivoEstadoTecnico.value = null
    },
    async handleArchivoEstadoTecnico(event) {
      const archivo = event.target.files[0]
      if (!archivo) return

      if (this.localData.documentoEstadoTecnicoUrl) {
        this.$emit('archivoEliminado', this.localData.documentoEstadoTecnicoUrl)
      }

      const ruta = `documentos/tecnico/${Date.now()}_${archivo.name}`
      const ref = storageRef(storage, ruta)

      try {
        await uploadBytes(ref, archivo)
        const url = await getDownloadURL(ref)
        this.localData.documentoEstadoTecnicoUrl = url
        this.$emit('archivoTemporal', url)
      } catch (error) {
        console.error('❌ Error al subir documento técnico:', error)
        alert('Error al subir el documento técnico. Revisa la consola.')
      }
    },
    agregarNombreAntiguo() {
      if (!this.localData.nombresAntiguos) {
        this.localData.nombresAntiguos = []
      }
      this.localData.nombresAntiguos.push({ nombre: '', anioHasta: '' })
    },
    eliminarNombreAntiguo(index) {
      this.localData.nombresAntiguos.splice(index, 1)
    },
    async handleImagenes(event) {
      const archivos = Array.from(event.target.files)
      for (const archivo of archivos) {
        const ruta = `imagenes/${Date.now()}_${archivo.name}`
        const ref = storageRef(storage, ruta)

        try {
          await uploadBytes(ref, archivo)
          const url = await getDownloadURL(ref)
          this.localData.imagenes.push(url)
          this.$emit('archivoTemporal', url)
        } catch (error) {
          console.error('❌ Error al subir imagen:', error)
          alert('Error al subir imagen. Revisa la consola.')
        }
      }
    },
    eliminarImagen(index) {
      const url = this.localData.imagenes[index]
      this.$emit('archivoEliminado', url)
      this.localData.imagenes.splice(index, 1)
    }
  }
}
</script>
