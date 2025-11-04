<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t, locale } = useI18n();
const router = useRouter();

const billingCycle = ref('monthly');
const selectedPlan = ref(null);
const showCheckoutModal = ref(false);

const plans = [
  {
    id: 'basic',
    name: t('basic'),
    monthlyPrice: 29,
    annualPrice: 290,
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '🌱',
    features: [
      { key: 'oneSessionMonthly', included: true },
      { key: 'messagingPsychologist', included: true },
      { key: 'accessEducationalResources', included: true },
      { key: 'groupSessions', included: false },
      { key: 'unlimitedPsychologistSwitch', included: false },
      { key: 'prioritySupport', included: false }
    ],
    badge: null,
    popular: false
  },
  {
    id: 'standard',
    name: t('standard'),
    monthlyPrice: 59,
    annualPrice: 590,
    color: '#f093fb',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '⭐',
    features: [
      { key: 'fourSessionsMonthly', included: true },
      { key: 'unlimitedMessaging', included: true },
      { key: 'accessEducationalResources', included: true },
      { key: 'twoGroupSessionsMonthly', included: true },
      { key: 'freePsychologistSwitch', included: true },
      { key: 'prioritySupport', included: false }
    ],
    badge: t('mostPopular'),
    popular: true
  },
  {
    id: 'premium',
    name: t('premium'),
    monthlyPrice: 99,
    annualPrice: 990,
    color: '#4facfe',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: '💎',
    features: [
      { key: 'unlimitedSessions', included: true },
      { key: 'unlimitedMessaging', included: true },
      { key: 'fullAccessResources', included: true },
      { key: 'unlimitedGroupSessions', included: true },
      { key: 'unlimitedPsychologistSwitch', included: true },
      { key: 'prioritySupport', included: true },
      { key: 'personalizedWellnessPlan', included: true }
    ],
    badge: null,
    popular: false
  }
];

const getPrice = (plan) => {
  return billingCycle.value === 'monthly' ? plan.monthlyPrice : Math.round(plan.annualPrice / 12);
};

const getSavings = (plan) => {
  const monthlyTotal = plan.monthlyPrice * 12;
  const annualTotal = plan.annualPrice;
  return Math.round(((monthlyTotal - annualTotal) / monthlyTotal) * 100);
};

const selectPlan = (plan) => {
  selectedPlan.value = plan;
  showCheckoutModal.value = true;
};

const closeModal = () => {
  showCheckoutModal.value = false;
  selectedPlan.value = null;
};

const processPurchase = () => {
  alert(t('subscriptionProcessed', { planName: selectedPlan.value.name }));
  closeModal();
  router.push('/');
};

const changeLanguage = (lang) => {
  locale.value = lang;
};
</script>

<template>
  <div class="subscriptions-container">
    <div class="header-section">
      <div class="header-content">
        <h1 class="main-title">{{ t('chooseYourPlan') }}</h1>
        <p class="main-subtitle">
          {{ t('mentalWellnessJourney') }}
        </p>
      </div>

      <div class="billing-toggle">
        <button
            @click="billingCycle = 'monthly'"
            :class="{ active: billingCycle === 'monthly' }"
            class="toggle-btn"
        >
          {{ t('monthly') }}
        </button>
        <button
            @click="billingCycle = 'annual'"
            :class="{ active: billingCycle === 'annual' }"
            class="toggle-btn"
        >
          {{ t('annual') }}
          <span class="save-badge">{{ t('save20') }}</span>
        </button>
      </div>

      <div class="language-selector">
        <select :value="locale" @change="changeLanguage($event.target.value)" class="lang-select">
          <option value="es">{{ t('spanish') }}</option>
          <option value="en">{{ t('english') }}</option>
        </select>
      </div>
    </div>

    <div class="pricing-grid">
      <div
          v-for="plan in plans"
          :key="plan.id"
          :class="{ popular: plan.popular }"
          class="pricing-card"
      >
        <div v-if="plan.popular" class="popular-badge">
          <i class="pi pi-star-fill"></i>
          {{ plan.badge }}
        </div>

        <div class="card-header">
          <div class="plan-icon" :style="{ background: plan.gradient }">
            {{ plan.icon }}
          </div>
          <h3 class="plan-name">{{ plan.name }}</h3>
          <p class="plan-description">
            {{ t(plan.id === 'basic' ? 'perfectToStart' : plan.id === 'standard' ? 'continuousSupport' : 'maximumSupport') }}
          </p>
        </div>

        <div class="price-section">
          <div class="price-wrapper">
            <span class="currency">$</span>
            <span class="price">{{ getPrice(plan) }}</span>
            <span class="period">{{ t('perMonth') }}</span>
          </div>
          <div v-if="billingCycle === 'annual'" class="savings-text">
            {{ t('saveAnnually', { percent: getSavings(plan) }) }}
          </div>
          <div v-else class="billing-text">
            {{ t('billedMonthly') }}
          </div>
        </div>

        <ul class="features-list">
          <li
              v-for="(feature, index) in plan.features"
              :key="index"
              :class="{ disabled: !feature.included }"
              class="feature-item"
          >
            <i :class="feature.included ? 'pi pi-check-circle' : 'pi pi-times-circle'" class="feature-icon"></i>
            <span>{{ t(feature.key) }}</span>
          </li>
        </ul>

        <button
            @click="selectPlan(plan)"
            :style="plan.popular ? { background: plan.gradient } : {}"
            class="cta-button"
        >
          <span>{{ t('choosePlan') }}</span>
          <i class="pi pi-arrow-right"></i>
        </button>
      </div>
    </div>

    <div class="trust-section">
      <div class="trust-card">
        <i class="pi pi-shield"></i>
        <h4>{{ t('securePayment') }}</h4>
        <p>{{ t('dataProtected') }}</p>
      </div>
      <div class="trust-card">
        <i class="pi pi-refresh"></i>
        <h4>{{ t('cancelAnytime') }}</h4>
        <p>{{ t('noCommitments') }}</p>
      </div>
      <div class="trust-card">
        <i class="pi pi-verified"></i>
        <h4>{{ t('certifiedPsychologists') }}</h4>
        <p>{{ t('accreditedProfessionals') }}</p>
      </div>
      <div class="trust-card">
        <i class="pi pi-clock"></i>
        <h4>{{ t('support247') }}</h4>
        <p>{{ t('hereToHelp') }}</p>
      </div>
    </div>

    <div class="faq-section">
      <h2 class="faq-title">{{ t('frequentQuestions') }}</h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h3>{{ t('canChangePlan') }}</h3>
          <p>{{ t('canChangePlanAnswer') }}</p>
        </div>
        <div class="faq-item">
          <h3>{{ t('howGuaranteeWorks') }}</h3>
          <p>{{ t('howGuaranteeWorksAnswer') }}</p>
        </div>
        <div class="faq-item">
          <h3>{{ t('canChangePsychologist') }}</h3>
          <p>{{ t('canChangePsychologistAnswer') }}</p>
        </div>
        <div class="faq-item">
          <h3>{{ t('acceptInsurance') }}</h3>
          <p>{{ t('acceptInsuranceAnswer') }}</p>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showCheckoutModal" class="modal-overlay" @click.self="closeModal">
        <div class="checkout-modal">
          <div class="modal-header">
            <h2>{{ t('confirmSubscription') }}</h2>
            <button @click="closeModal" class="close-btn">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div v-if="selectedPlan" class="modal-body">
            <div class="plan-summary">
              <div class="summary-icon" :style="{ background: selectedPlan.gradient }">
                {{ selectedPlan.icon }}
              </div>
              <div class="summary-details">
                <h3>{{ selectedPlan.name }}</h3>
                <p>{{ t(selectedPlan.id === 'basic' ? 'perfectToStart' : selectedPlan.id === 'standard' ? 'continuousSupport' : 'maximumSupport') }}</p>
              </div>
            </div>

            <div class="price-breakdown">
              <div class="breakdown-row">
                <span>{{ t('plan') }} {{ selectedPlan.name }}</span>
                <span class="price-amount">
                  ${{ billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.annualPrice }}
                </span>
              </div>
              <div v-if="billingCycle === 'annual'" class="breakdown-row savings">
                <span>{{ t('annualDiscount', { percent: getSavings(selectedPlan) }) }}</span>
                <span class="price-amount">
                  -${{ (selectedPlan.monthlyPrice * 12) - selectedPlan.annualPrice }}
                </span>
              </div>
              <div class="breakdown-row total">
                <span>{{ t('total') }} {{ billingCycle === 'monthly' ? t('monthly_lowercase') : t('annual_lowercase') }}</span>
                <span class="price-amount">
                  ${{ billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.annualPrice }}
                </span>
              </div>
            </div>

            <div class="payment-info">
              <p class="info-text">
                <i class="pi pi-info-circle"></i>
                {{ t('redirectToPayment') }}
              </p>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="closeModal" class="btn-secondary">
              {{ t('cancel') }}
            </button>
            <button @click="processPurchase" class="btn-primary">
              <i class="pi pi-lock"></i>
              {{ t('proceedToPayment') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.subscriptions-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-section {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
}

.header-content {
  margin-bottom: 2rem;
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.main-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.billing-toggle {
  display: inline-flex;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.toggle-btn {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.save-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toggle-btn.active .save-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.language-selector {
  position: absolute;
  top: 0;
  right: 0;
}

.lang-select {
  padding: 0.75rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-select:hover {
  border-color: #667eea;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.pricing-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  padding: 2.5rem;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.pricing-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.pricing-card.popular {
  border-color: #667eea;
  border-width: 3px;
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
}

.popular-badge {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.plan-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1.5rem auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.plan-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.75rem 0;
}

.plan-description {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.price-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f1f5f9;
}

.price-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.currency {
  font-size: 1.5rem;
  font-weight: 700;
  color: #475569;
  margin-right: 0.25rem;
  margin-top: 0.75rem;
}

.price {
  font-size: 4rem;
  font-weight: 800;
  color: #1a202c;
  line-height: 1;
}

.period {
  font-size: 1.25rem;
  color: #64748b;
  margin-left: 0.5rem;
  align-self: flex-end;
  margin-bottom: 0.75rem;
}

.savings-text {
  color: #059669;
  font-weight: 600;
  font-size: 0.95rem;
}

.billing-text {
  color: #64748b;
  font-size: 0.95rem;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  flex: 1;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.5;
}

.feature-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.feature-item:not(.disabled) .feature-icon {
  color: #10b981;
}

.feature-item.disabled {
  color: #94a3b8;
}

.feature-item.disabled .feature-icon {
  color: #cbd5e1;
}

.cta-button {
  width: 100%;
  padding: 1.25rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.pricing-card.popular .cta-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.trust-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  padding: 3rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 24px;
}

.trust-card {
  text-align: center;
}

.trust-card i {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.trust-card h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.trust-card p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.faq-section {
  margin-bottom: 3rem;
}

.faq-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin: 0 0 2.5rem 0;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.faq-item {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: #667eea;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.1);
}

.faq-item h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.75rem 0;
}

.faq-item p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.2s ease;
}

.checkout-modal {
  background: white;
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 2px solid #f1f5f9;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #64748b;
  font-size: 1.2rem;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.plan-summary {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  margin-bottom: 2rem;
}

.summary-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-details h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.summary-details p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.price-breakdown {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  font-size: 0.95rem;
  color: #334155;
}

.breakdown-row.savings {
  color: #059669;
  font-weight: 600;
}

.breakdown-row.total {
  border-top: 2px solid #e2e8f0;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
}

.price-amount {
  font-weight: 700;
}

.payment-info {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 1rem;
}

.info-text {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #1e40af;
  margin: 0;
}

.info-text i {
  font-size: 1.2rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 2px solid #f1f5f9;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #475569;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

@media (max-width: 768px) {
  .subscriptions-container {
    padding: 2rem 1rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .main-subtitle {
    font-size: 1rem;
  }

  .language-selector {
    position: static;
    margin-top: 1rem;
  }

  .pricing-grid {
    grid-template-columns: 1fr;
  }

  .trust-section {
    grid-template-columns: 1fr;
    padding: 2rem 1.5rem;
  }

  .faq-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>
