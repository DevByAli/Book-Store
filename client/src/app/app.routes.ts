import { Routes } from '@angular/router';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { BookStoreComponent } from './components/book-store/book-store.component';
import { OrderCancelComponent } from './components/order-cancel/order-cancel.component';
import { SearchedResultComponent } from './components/searched-result/searched-result.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { authGuard } from './utils/authGuard';
import { adminGuard } from './utils/adminGuard';
import { NotAccessibleComponent } from './components/not-accessible/not-accessible.component';
import { redirectGuard } from './utils/redirectGuard';
import { TagComponent } from './components/tag/tag.component';
import { userGuard } from './utils/userGuard';
import { loginAndRegisterGuard } from './utils/loginAndRegisterGuard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [loginAndRegisterGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Resgiter',
    canActivate: [loginAndRegisterGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: redirectGuard,
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard',
        canActivate: [adminGuard],
      },
      {
        path: 'add-book',
        component: AddBookComponent,
        title: 'Add Book',
        canActivate: [adminGuard],
      },
      {
        path: 'edit-book',
        component: AddBookComponent,
        title: 'Edit Book',
        canActivate: [adminGuard],
      },
      {
        path: 'book-details',
        component: BookDetailsComponent,
        title: 'Book Detail',
      },
      {
        path: 'store',
        component: BookStoreComponent,
        title: 'Store',
      },
      {
        path: 'tags',
        component: TagComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'create-order',
        component: CreateOrderComponent,
        title: 'Create Order',
        canActivate: [userGuard],
      },
      {
        path: 'cancel-order',
        component: OrderCancelComponent,
        title: 'Cancel Order',
        canActivate: [userGuard],
      },
      {
        path: 'order-list',
        component: OrdersListComponent,
        title: 'Order List',
        canActivate: [userGuard],
      },
      { path: 'profile', component: ProfileComponent, title: 'Profile' },
      {
        path: 'searched-result',
        component: SearchedResultComponent,
        title: 'Search',
      },
      {
        path: 'not-accessible',
        component: NotAccessibleComponent,
        title: 'Not accessible',
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not found 404',
  },
];
