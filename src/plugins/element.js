import Vue from 'vue'
import {
    Button,
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Table,
    TableColumn,
    Form,
    FormItem,
    Col,
    Input,
    Icon,
    Message
} from 'element-ui'

Vue.use(Button);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Col);
Vue.use(Input);
Vue.use(Icon);
//massage需要进行全局挂载
Vue.prototype.$message = Message;