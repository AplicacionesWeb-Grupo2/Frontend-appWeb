<script setup>
import { ref, computed } from 'vue';
import logoUrl from '../assets/icons/logo_EiraMind.png';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { authService } from '../services/authService';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const isCollapsed = ref(false);
const user = ref(authService.getCurrentUser());

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const logout = () => {
  authService.logout();
  router.push('/login');
};

const navigationItems = [
  {
    name: 'Inicio',
    icon: 'pi-home',
    route: '/',
    color: '#667eea'
  },
  {
    name: 'Paquetes',
    icon: 'pi-box',
    route: '/suscripciones',
    color: '#f093fb'
  },
  {
    name: 'Grabaciones',
    icon: 'pi-video',
    route: '/grabaciones',
    color: '#4facfe',
    badge: 3
  },
  {
    name: 'Psicólogos',
    icon: 'pi-users',
    route: '/psicologos',
    color: '#43e97b'
  },
  {
    name: 'Agenda',
    icon: 'pi-calendar',
    route: '/agenda',
    color: '#f59e0b'
  }
];

const isActive = (routePath) => {
  return route.path === routePath;
};
</script>

<template>
  <aside :class="{ collapsed: isCollapsed }" class="sidebar">
    <button @click="toggleSidebar" class="toggle-btn" title="Colapsar/Expandir">
      <i :class="isCollapsed ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'"></i>
    </button>

    <div class="sidebar-header">
      <div class="logo-section">
        <div class="logo-wrapper">
          <pv-Image :src="logoUrl" alt="EiraMind logo" class="logo-icon"/>
        </div>
        <transition name="fade">
          <div v-if="!isCollapsed" class="logo-text-wrapper">
            <h2 class="logo-text">Eira<span class="logo-highlight">Mind</span></h2>
          </div>
        </transition>
      </div>
    </div>

    <div class="user-profile" :class="{ collapsed: isCollapsed }">
      <div class="user-avatar">
        <i class="pi pi-user"></i>
      </div>
      <transition name="fade">
        <div v-if="!isCollapsed" class="user-info">
          <p class="user-name">{{ user?.nombre || 'Usuario' }}</p>
          <p class="user-role">Paciente</p>
        </div>
      </transition>
    </div>

    <nav class="sidebar-nav">
      <router-link
          v-for="item in navigationItems"
          :key="item.route"
          :to="item.route"
          :class="{ active: isActive(item.route) }"
          class="nav-item"
          :title="item.name"
      >
        <div class="nav-icon-wrapper">
          <i :class="'pi ' + item.icon" class="nav-icon" :style="{ color: isActive(item.route) ? 'white' : item.color }"></i>
          <span v-if="item.badge && !isCollapsed" class="badge">{{ item.badge }}</span>
        </div>
        <transition name="fade">
          <span v-if="!isCollapsed" class="nav-label">{{ item.name }}</span>
        </transition>
        <transition name="fade">
          <i v-if="!isCollapsed && isActive(item.route)" class="pi pi-chevron-right nav-arrow"></i>
        </transition>
      </router-link>
    </nav>

    <div class="spacer"></div>

    <div class="sidebar-bottom">
      <router-link
          to="/configuracion"
          :class="{ active: isActive('/configuracion') }"
          class="nav-item settings-item"
          title="Configuración"
      >
        <div class="nav-icon-wrapper">
          <i class="pi pi-cog nav-icon"></i>
        </div>
        <transition name="fade">
          <span v-if="!isCollapsed" class="nav-label">Configuración</span>
        </transition>
      </router-link>

      <button @click="logout" class="logout-btn" title="Cerrar Sesión">
        <div class="nav-icon-wrapper">
          <i class="pi pi-sign-out"></i>
        </div>
        <transition name="fade">
          <span v-if="!isCollapsed">Cerrar Sesión</span>
        </transition>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.06);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 80px;
}

.toggle-btn {
  position: absolute;
  top: 1.5rem;
  right: -15px;
  width: 30px;
  height: 30px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 101;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toggle-btn:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-start;
}

.sidebar.collapsed .logo-section {
  justify-content: center;
}

.logo-wrapper {
  flex-shrink: 0;
}

.logo-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  overflow: hidden;
}

.logo-icon:deep(img) {
  width: 50px !important;
  height: 50px !important;
  object-fit: contain;
}

.logo-text-wrapper {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #003d91;
  margin: 0;
  white-space: nowrap;
}

.logo-highlight {
  color: #4dc7e2;
  font-weight: 800;
}

.user-profile {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  transition: all 0.3s ease;
}

.user-profile.collapsed {
  justify-content: center;
  padding: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  text-decoration: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 0.875rem;
}

.nav-item:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  color: #667eea;
  transform: translateX(4px);
}

.sidebar.collapsed .nav-item:hover {
  transform: translateX(0) scale(1.05);
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: white;
  border-radius: 0 4px 4px 0;
}

.sidebar.collapsed .nav-item.active::before {
  display: none;
}

.nav-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.nav-icon {
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.nav-item.active .nav-icon {
  color: white !important;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
}

.nav-label {
  flex: 1;
}

.nav-arrow {
  font-size: 0.9rem;
  margin-left: auto;
  color: white;
}

.spacer {
  flex: 1;
}

.sidebar-bottom {
  padding: 0.75rem;
  border-top: 1px solid #e2e8f0;
  background: linear-gradient(180deg, transparent 0%, rgba(248, 250, 252, 0.5) 100%);
}

.settings-item {
  margin-bottom: 0.5rem;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.sidebar.collapsed .logout-btn {
  justify-content: center;
  padding: 0.875rem;
}

.logout-btn:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  color: #ef4444;
  transform: translateX(4px);
}

.sidebar.collapsed .logout-btn:hover {
  transform: translateX(0) scale(1.05);
}

.logout-btn i {
  font-size: 1.25rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }

  .toggle-btn {
    display: none;
  }

  .user-profile {
    justify-content: center;
    padding: 1rem;
  }

  .user-info,
  .nav-label,
  .nav-arrow,
  .logo-text-wrapper {
    display: none !important;
  }

  .nav-item {
    justify-content: center;
    padding: 0.875rem;
  }

  .logout-btn {
    justify-content: center;
    padding: 0.875rem;
  }
}
</style>
