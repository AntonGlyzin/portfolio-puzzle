<template>
  <div class="container">
    <div class="main-body pt-6">
      <div class="row gutters-sm">
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-column align-items-center text-center">
                <div
                  class="m-2 mb-3 transition-colors transition-duration-300 hover:text-orange-600 cursor-pointer"
                  @click="copyLinkProfile"
                >
                  <i
                    class="fa fa-link"
                    aria-hidden="true"
                  />
                  <span>Ссылка на профиль</span>
                </div>
                <Image
                  :src="user.photo_user"
                  :alt="user.user"
                  width="150"
                  preview
                />
                <div class="mt-3">
                  <h4>{{ user.user }}</h4>
                </div>
              </div>
              <div
                v-if="$store.state.user && myUsername !== username"
                class="d-flex justify-content-center"
              >
                <Button
                  v-if="!user.is_my_follower"
                  label="Подписаться"
                  class="p-button-secondary p-2 border-noround w-100"
                  icon="pi pi-user-plus"
                  @click="FollowMe"
                />
                <Button
                  v-if="user.is_my_follower"
                  label="Отписаться"
                  class="p-button-outlined  border-noround p-button-secondary p-2 w-100"
                  icon="pi pi-user-minus"
                  @click="FollowMe"
                />
              </div>
              <div
                v-if="$store.state.user"
                class="d-flex justify-content-center pt-2"
              >
                <Button
                  label="Написать"
                  class="p-button-secondary border-noround p-button-secondary p-2 w-100"
                  icon="fa fa-commenting-o"
                  @click="dialogMessage = true"
                />
              </div>
            </div>
          </div>
          <div class="card mt-3">
            <div class="panel-heading text-dark fw-bold">
              <span class="ms-2">
                <i class="fa fa-trophy" />
              </span>
              <span class="ms-1"> My Skills</span>
            </div>
            <div class="card-body">
              <span
                v-for="skill in user.myskils"
                :key="skill.id"
                class="badge bg-secondary fw-normal me-1"
              >{{ skill.name }}</span>
            </div>
          </div>
          <div class="card mt-3">
            <ul class="list-group list-group-flush">
              <li
                v-for="link in user.links"
                :key="link.name"
                class="list-group-item d-flex justify-content-between align-items-center flex-wrap"
              >
                <h6 class="mb-0">
                  <i
                    :class="link.style"
                    aria-hidden="true"
                  />
                </h6>
                <a
                  v-if="link.link && link.name !== 'Email'"
                  class="text-reset"
                  :href="link.link"
                ><i
                  class="fa fa-share"
                  aria-hidden="true"
                />{{ link.name }}</a>
                <a
                  v-if="link.link && link.name === 'Email'"
                  class="text-reset"
                  :href="'mailto:'+link.link"
                ><i
                  class="fa fa-share"
                  aria-hidden="true"
                />{{ link.name }}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-4">
                  <h6 class="mb-0 fw-bold">
                    <i class="fa fa-briefcase" /> Проектов
                  </h6>
                </div>
                <div class="col-sm-3 text-secondary">
                  {{ user.count_projects }} шт
                </div>
                <div
                  v-if="user.count_projects"
                  class="col-sm-5"
                >
                  <i class="fa fa-share" /><router-link
                    class="text-reset"
                    :to="'/portfolio?user='+username"
                  >
                    К проектам
                  </router-link>
                </div>
              </div>
              <div class="row">
                <div class="d-flex flex-wrap">
                  <router-link
                    v-for="project_tags in user.project_tags"
                    :key="project_tags"
                    :to="'/portfolio?user='+username+'&tags='+project_tags.slug"
                  >
                    <span class="badge bg-secondary fw-normal me-1 underline">{{ project_tags.name }}</span>
                  </router-link>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-4">
                  <h6 class="mb-0 fw-bold">
                    <i class="fa fa-edit" /> Записей
                  </h6>
                </div>
                <div class="col-sm-3 text-secondary">
                  {{ user.count_posts }} шт
                </div>
                <div
                  v-if="user.count_posts"
                  class="col-sm-5"
                >
                  <i class="fa fa-share" /><router-link
                    class="text-reset"
                    :to="'/blog?user='+username"
                  >
                    К записям
                  </router-link>
                </div>
              </div>
              <div class="row">
                <div class="d-flex flex-wrap">
                  <router-link
                    v-for="blog_tags in user.blog_tags"
                    :key="blog_tags"
                    :to="'/blog?user='+username+'&tags='+blog_tags.slug"
                  >
                    <span class="badge bg-secondary fw-normal me-1 underline">{{ blog_tags.name }}</span>
                  </router-link>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-4">
                  <h6 class="mb-0 fw-bold">
                    <i class="fa fa-calendar" /> Событий
                  </h6>
                </div>
                <div class="col-sm-3 text-secondary">
                  {{ user.count_events }} шт
                </div>
                <div
                  v-if="user.count_events"
                  class="col-sm-5"
                >
                  <i class="fa fa-share" /><router-link
                    class="text-reset"
                    :to="'/events?user='+username"
                  >
                    К хронологии
                  </router-link>
                </div>
              </div>
              <div class="row">
                <Tree
                  :value="nodeProjects"
                  scroll-height="300px"
                >
                  <template #url="slotProps">
                    <router-link :to="'/events?user='+username+'&'+'project='+slotProps.node.id">
                      {{ slotProps.node.title }}
                    </router-link>
                  </template>
                </Tree>
              </div>
            </div>
          </div>

          <div class="row gutters-sm">
            <div class="col-sm-12 mb-3">
              <div class="card h-100">
                <div class="card-body">
                  <h6 class="d-flex align-items-center mb-0 fw-bold">
                    Умения
                  </h6>
                  <small class="mb-3 text-muted">(Высчитываются на основе событий и отображают процент пользование умением)</small>
                  <div
                    v-for="skill in user.myskils"
                    :key="skill.id"
                  >
                    <small>
                      <router-link
                        class="text-reset"
                        :to="'/events?user='+username+'&tags='+skill.slug"
                      >{{ skill.name }}</router-link>
                    </small>
                    <ProgressBar
                      v-tooltip.top="`Выполненных задач - ${skill.timeline_count}`"
                      :value="skill.percent_timeline"
                      class="h-1rem"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast
      position="center"
      group="tl"
    />
    <Dialog
      v-model:visible="dialogMessage"
      header="Написать сообщение"
      :breakpoints="{'960px': '75vw', '640px': '90vw'}"
      :style="{width: '50vw'}"
      :position="position"
      :modal="true"
    >
      <div class="chat-message-editor">
        <v-md-editor
          v-model="textMessage"
          height="200px"
          :left-toolbar="'emoji'"
          :right-toolbar="'preview'"
        />
      </div>
      <template #footer>
        <Button
          label="Закрыть"
          icon="pi pi-times"
          class="p-button-text"
          @click="dialogMessage = false"
        />
        <Button
          label="Отправить"
          class="border-noround"
          :icon="isLoadSend ? 'pi pi-spin pi-spinner' : 'pi pi-send'"
          autofocus
          @click="sendMessage"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { copyText } from '@/components/copyText'
export default {
  name: 'UserCard',
  metaInfo () {
    return {
      title: this.user.user,
      meta: [
        {
          name: 'description',
          content: 'Анкета пользователя. Здесь описанны навыки, проекты и записи пользователя по его направлению. '
        },
        {
          name: 'Keywords',
          content: this.keyWords
        }
      ]
    }
  },
  props: {
    users: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      hostws: this.$store.state.hostws,
      dialogMessage: false,
      socket: null,
      isLoadSend: false,
      textMessage: '',
      position: 'left',
      user: {},
      host: null,
      nodeProjects: [
        {
          id: 0,
          label: 'По проектам',
          children: []
        }
      ]
    }
  },
  computed: {
    username () {
      return this.$route.href.split('/').slice(-1)[0]
    },
    myUsername () {
      if (!this.$store.state.user) return undefined
      return this.$store.state.user.user.username
    },
    keyWords () {
      let str = ''
      if (!this.user.myskils) return ''
      for (const myskils of this.user.myskils) {
        str = str + ' ' + myskils.name
      }
      return str
    }
  },
  watch: {
    users (val) {
      if (val) this.getPage()
    }
  },
  mounted () {
    this.host = this.$store.state.hostmeapi
    this.getPage()
  },
  methods: {
    copyLinkProfile () {
      const href = window.location.href
      const result = copyText(href)
      if (result) {
          this.$toast.add({
            severity: 'success',
            summary: 'Уведомление',
            detail: 'Ссылка на профиль скопирована',
            life: 3000,
            group: 'tl'
          })
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Уведомление',
          detail: 'Ссылку не удалось скопировать',
          life: 3000,
          group: 'tl'
        })
      }
    },
    sendMessage () {
      if (!this.textMessage) return false
      this.$store.commit('setSendSocket',
            {
              action: 'being_message',
              request_id: 'user_'+this.myUsername,
              text: this.textMessage,
              to_username: this.username
            }
        )
      this.dialogMessage = false
      this.textMessage = ''
      this.$toast.add({
        severity: 'success',
        summary: 'Уведомление',
        detail: 'Сообщение отправленно',
        life: 3000,
        group: 'tl'
      })
    },
    FollowMe () {
      const data = {
        follower: [this.user.id]
      }
      this.$store.commit('setIsLoad', true)
      this.$http.put(this.host + '/detail/user/follower', data)
        .then(res => {
          this.user.is_my_follower = !this.user.is_my_follower
        }).catch(res => {}).then(() => { this.$store.commit('setIsLoad', false) })
    },
    getPage () {
      const host = this.$store.state.hostmeapi
      this.$store.commit('setIsLoad', true)
      this.$http.get(host + this.$route.href)
        .then(res => {
          this.user = res.data
          for (const prj of this.user.links_project) {
            prj.type = 'url'
            this.nodeProjects[0].children.push(prj)
          }
        }).catch(res => {
        }).then(() => { this.$store.commit('setIsLoad', false) })
    }
  }
}
</script>

<style lang="scss" >
.main-body {
    padding: 15px;

.card {
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
}

.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 0 solid rgba(0,0,0,.125);
    border-radius: .25rem;
}

.card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 1rem;
}

.gutters-sm {
    margin-right: -8px;
    margin-left: -8px;
}

.gutters-sm>.col, .gutters-sm>[class*=col-] {
    padding-right: 8px;
    padding-left: 8px;
}
.mb-3, .my-3 {
    margin-bottom: 1rem!important;
}

.bg-gray-300 {
    background-color: #e2e8f0;
}
.h-100 {
    height: 100%!important;
}
.shadow-none {
    box-shadow: none!important;
}
.panel-body {
  position: relative;
  padding: 15px;
  border: 1px solid #e2e2e2;
}
.panel-body + .panel-footer {
  border-top: 0;
}
.panel-heading {
  position: relative;
  height: 52px;
  line-height: 49px;
  letter-spacing: 0.2px;
  color: #999999;
  font-size: 15px;
  font-weight: 400;
  padding: 0 8px;
  background: #fafafa;
  border: 1px solid #e2e2e2;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
}
.panel-heading + .panel-body {
  border-top: 0;
}
.p-progressbar .p-progressbar-value {
    background: #e67e22 !important;
}
}
</style>
