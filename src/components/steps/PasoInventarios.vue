<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 6: Inventarios</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Clase de Inventario -->
      <div>
        <label class="block mb-1 font-medium">Clase de Inventario</label>
        <input v-model="localData.claseInventario" type="text" class="w-full p-2 border rounded" />
      </div>

      <!-- Fecha del Último Inventario -->
      <div>
        <label class="block mb-1 font-medium">Fecha del Último Inventario</label>
        <input v-model="localData.fechaUltimoInventario" type="date" class="w-full p-2 border rounded" />
      </div>

      <!-- Documento asociado -->
      <div class="md:col-span-2">
        <label class="block mb-1 font-medium">Documento de inventario</label>

        <input
          v-if="!localData.documentoClaseInventarioUrl"
          type="file"
          accept="application/pdf"
          @change="handleArchivoInventario"
          class="mt-2"
        />

        <div
          v-if="localData.documentoClaseInventarioUrl"
          class="mt-4 bg-gray-100 p-3 rounded shadow text-sm text-black"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 1.5a1 1 0 0 1 1 0l6 3A1 1 0 0 1 17 5v10a1 1 0 0 1-.553.894l-6 3a1 1 0 0 1-.894 0l-6-3A1 1 0 0 1 3 15V5a1 1 0 0 1 .553-.894l6-3zM10 11H9v4H8v-4H7v-1h3v1z" />
              </svg>
              <a
                :href="localData.documentoClaseInventarioUrl"
                target="_blank"
                class="text-black font-medium underline hover:text-gray-700"
              >
                Ver documento cargado
              </a>
            </div>
            <div class="flex items-center gap-4">
              <button
                class="text-sm text-gray-600 hover:text-black font-semibold underline"
                @click="triggerInputInventario"
              >
                Reemplazar documento
              </button>
              <button
                class="text-sm text-red-600 hover:text-red-800 font-semibold underline"
                @click="eliminarArchivoInventario"
              >
                Eliminar documento
              </button>
            </div>
          </div>
          <div class="ml-7 mt-1 text-gray-500 text-xs">
            {{ nombreArchivoInventario }}
          </div>
          <input
            ref="inputArchivoInventario"
            type="file"
            accept="application/pdf"
            class="hidden"
            @change="handleArchivoInventario"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase/config'

export default {
  name: 'PasoInventarios',
  props: ['modelValue'],
  computed: {
    localData: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    nombreArchivoInventario() {
      const url = this.localData.documentoClaseInventarioUrl
      if (!url) return ''
      try {
        const decoded = decodeURIComponent(url)
        return decoded.substring(decoded.lastIndexOf('/') + 1).split('?')[0]
      } catch (e) {
        return 'Documento cargado'
      }
    }
  },
  methods: {
    triggerInputInventario() {
      this.$refs.inputArchivoInventario.click()
    },
    eliminarArchivoInventario() {
      if (!this.localData.documentoClaseInventarioUrl) return
      const confirmar = confirm('¿Deseas eliminar el documento cargado?')
      if (!confirmar) return
      this.$emit('archivoEliminado', this.localData.documentoClaseInventarioUrl)
      this.localData.documentoClaseInventarioUrl = ''
      this.$refs.inputArchivoInventario.value = null
    },
    async handleArchivoInventario(event) {
      const archivo = event.target.files[0]
      if (!archivo) return

      if (this.localData.documentoClaseInventarioUrl) {
        this.$emit('archivoEliminado', this.localData.documentoClaseInventarioUrl)
      }

      const ruta = `documentos/inventarios/${Date.now()}_${archivo.name}`
      const ref = storageRef(storage, ruta)

      try {
        await uploadBytes(ref, archivo)
        const url = await getDownloadURL(ref)
        this.localData.documentoClaseInventarioUrl = url
        this.$emit('archivoTemporal', url)
        console.log('✅ Documento de inventario subido:', url)
      } catch (error) {
        console.error('❌ Error al subir documento:', error)
        alert('Error al subir el documento. Revisa la consola.')
      }
    }
  }
}
</script>
