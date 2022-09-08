import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import '@/assets/css/style.scss'
import '@/assets/css/font-awesome.min.css'
import intersection from '@/directives/Vintersection'
import viewIntersection from '@/directives/IntersectionView'
import PrimeVue from 'primevue/config'
import MetaInfo from 'vue-meta-info'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap-vue/dist/bootstrap-vue.js'
import ToastService from 'primevue/toastservice'
import 'primeflex/primeflex.min.css'
import 'primeicons/primeicons.css'
import Tooltip from 'primevue/tooltip'
import Ripple from 'primevue/ripple'
import 'primevue/resources/primevue.min.css'
// import 'primevue/resources/themes/arya-orange/theme.css'
import '@/assets/css/primevue-theme.css'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
// import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import rus from '@kangc/v-md-editor/lib/lang/ru-RU'
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index'
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import hljs from 'highlight.js'
import AvatarGroup from 'primevue/avatargroup'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Toast from 'primevue/toast'
import ScrollTop from 'primevue/scrolltop'
import Textarea from 'primevue/textarea'
import spinnerMe from '@/components/UI/spinnerMe.vue'
import btnCustomVue from '@/components/UI/btnCustom.vue'
import heartPostVue from '@/components/UI/heartPost.vue'
import showUsersLikeVue from '@/components/UI/showUsersLike.vue'
import addEventVue from '@/components/UI/addEvent.vue'
import Image from 'primevue/image'
import ProgressBar from 'primevue/progressbar'
import Rating from 'primevue/rating'
import MultiSelect from 'primevue/multiselect'
import Chip from 'primevue/chip'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import OverlayPanel from 'primevue/overlaypanel'
import Dropdown from 'primevue/dropdown'
import Password from 'primevue/password'
import Message from 'primevue/message'
import InlineMessage from 'primevue/inlinemessage'
import Tree from 'primevue/tree'
import Toolbar from 'primevue/toolbar'
import SpeedDial from 'primevue/speeddial'
import Badge from 'primevue/badge'
import BadgeDirective from 'primevue/badgedirective'
import Panel from 'primevue/panel'
import Menu from 'primevue/menu'
import ScrollPanel from 'primevue/scrollpanel'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import DataView from 'primevue/dataview'
import SplitButton from 'primevue/splitbutton'
import Cookies from 'js-cookie'
import ReconnectingWebSocket from '../src/assets/js/reconnecting-websocket.min'

const objSettingsKangc = [
  createEmojiPlugin(),
  createLineNumbertPlugin(),
  createCopyCodePlugin()
]
VMdEditor.lang.use('ru-RU', rus)
VMdEditor.use(githubTheme, { Hljs: hljs })
VMdPreview.use(githubTheme, { Hljs: hljs })
objSettingsKangc.forEach(item => { VMdEditor.use(item) })
objSettingsKangc.forEach(item => { VMdPreview.use(item) })

const library = [
  store,
  router,
  MetaInfo,
  ToastService,
  VMdEditor,
  VMdPreview
]

const app = createApp(App)
app.directive(intersection.name, intersection)
app.directive(viewIntersection.name, viewIntersection)
app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)
app.directive('badge', BadgeDirective)

const libComponents = [
  { name: 'Avatar', el: Avatar },
  { name: 'AvatarGroup', el: AvatarGroup },
  { name: 'Textarea', el: Textarea },
  { name: 'ScrollTop', el: ScrollTop },
  { name: 'Toast', el: Toast },
  { name: 'Calendar', el: Calendar },
  { name: 'Button', el: Button },
  { name: 'spinnerMe', el: spinnerMe },
  { name: 'btnCustomVue', el: btnCustomVue },
  { name: 'heartPostVue', el: heartPostVue },
  { name: 'showUsersLikeVue', el: showUsersLikeVue },
  { name: 'addEventVue', el: addEventVue },
  { name: 'Image', el: Image },
  { name: 'ProgressBar', el: ProgressBar },
  { name: 'Rating', el: Rating },
  { name: 'MultiSelect', el: MultiSelect },
  { name: 'Chip', el: Chip },
  { name: 'Dialog', el: Dialog },
  { name: 'TabPanel', el: TabPanel },
  { name: 'TabView', el: TabView },
  { name: 'Checkbox', el: Checkbox },
  { name: 'InputText', el: InputText },
  { name: 'DataTable', el: DataTable },
  { name: 'Column', el: Column },
  { name: 'OverlayPanel', el: OverlayPanel },
  { name: 'Dropdown', el: Dropdown },
  { name: 'Password', el: Password },
  { name: 'Message', el: Message },
  { name: 'InlineMessage', el: InlineMessage },
  { name: 'Tree', el: Tree },
  { name: 'Toolbar', el: Toolbar },
  { name: 'SpeedDial', el: SpeedDial },
  { name: 'Badge', el: Badge },
  { name: 'Panel', el: Panel },
  { name: 'Menu', el: Menu },
  { name: 'ScrollPanel', el: ScrollPanel },
  { name: 'Accordion', el: Accordion },
  { name: 'AccordionTab', el: AccordionTab },
  { name: 'DataView', el: DataView },
  { name: 'SplitButton', el: SplitButton }
]
libComponents.forEach(item => {
  app.component(item.name, item.el)
})

app.use(PrimeVue, { ripple: true })
library.forEach(item => {
  app.use(item)
})

app.config.globalProperties.$http = axios
app.config.globalProperties.$cookies = Cookies
app.config.globalProperties.$ReconnectingWebSocket = ReconnectingWebSocket
app.mount('#app')
