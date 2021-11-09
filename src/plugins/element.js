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
    Row,
    Input,
    Icon,
    Message,
    MessageBox,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Pagination,
    Switch,
    Tooltip,
    Dialog,
    Select,
    Option,
    Tag
} from 'element-ui'

//massage需要进行全局挂载
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

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
Vue.use(Row);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Pagination);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);
Vue.use(Tag);