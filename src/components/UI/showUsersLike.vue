<template>
  <OverlayPanel
    id="showUsersLike"
    ref="slotUsers"
    append-to="body"
    :show-close-icon="true"
    style="width: 300px;"
    @hide="showUserLikes"
  >
    <DataTable
      :filters="filters"
      :value="users"
      :scrollable="true"
      scroll-height="400px"
      :global-filter-fields="['full_name',]"
    >
      <template #header>
        <div class="flex justify-content-end">
          <span class="p-input-icon-left ">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['full_name'].value"
              placeholder="Поиск..."
            />
          </span>
        </div>
      </template>
      <template #empty>
        Нет совпадений.
      </template>
      <template #loading>
        Идет поиск...
      </template>
      <Column>
        <template #body="slotProps">
          <router-link :to="'/card/user/'+slotProps.data.username">
            <Avatar
              v-if="slotProps.data.photo"
              :image="slotProps.data.photo"
              class="mr-2"
              size="large"
              shape="circle"
            />
            <i
              v-else
              class="fa fa-user-circle-o likeshow-ava"
              aria-hidden="true"
            />
          </router-link>
        </template>
      </Column>
      <Column field="full_name">
        <template #body="slotProps">
          <router-link
            :to="'/card/user/'+slotProps.data.username"
            class="text-reset"
          >
            {{ slotProps.data.full_name }}
          </router-link>
        </template>
      </Column>
    </DataTable>
  </OverlayPanel>
</template>
<script>
import { FilterMatchMode } from 'primevue/api'
export default {
  name: 'ShowUsersLike',
  props: {
    users: {
      type: Array,
      default: null
    },
    evnt: {
      type: Object,
      default: null
    },
    visible: [Boolean]
  },
  data () {
    return {
      filters: {
        full_name: { value: null, matchMode: FilterMatchMode.CONTAINS }
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$refs.slotUsers.toggle(this.evnt)
      }
    }
  },
  methods: {
    showUserLikes () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" >
#showUsersLike{
    z-index: 1031 !important;
    .p-overlaypanel-close{
            background: #e67e22;
    }
    .p-overlaypanel .p-overlaypanel-close:enabled:hover {
        background: #e67e22;
    }
    .likeshow-ava{
      color: #454c50;
      font-size: 2.7em;
    }
}
</style>
