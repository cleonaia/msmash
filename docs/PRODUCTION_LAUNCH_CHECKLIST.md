# Production Launch Checklist

## 1) Delivery Integrations
- [ ] UberEats: production API key + merchant ID configured in admin panel
- [ ] Glovo: production API key + merchant ID configured in admin panel
- [ ] Deliveroo: production API key + merchant ID configured in admin panel
- [ ] Just Eat: production API key + merchant ID configured in admin panel
- [ ] Webhooks configured in every provider dashboard:
  - [ ] `https://<domain>/api/webhooks/ubereats`
  - [ ] `https://<domain>/api/webhooks/glovo`
  - [ ] `https://<domain>/api/webhooks/deliveroo`
  - [ ] `https://<domain>/api/webhooks/justeat`
- [ ] Signature secrets configured in production env
- [ ] End-to-end tests done for each platform status:
  - [ ] received
  - [ ] accepted
  - [ ] prepared
  - [ ] collected
  - [ ] delivered
  - [ ] cancelled

## 2) Payments and Billing
- [ ] Stripe LIVE keys configured
- [ ] Stripe LIVE webhook configured and tested
- [ ] Payment success flow tested with real card
- [ ] Payment failed flow tested
- [ ] Refund flow tested from admin panel
- [ ] Price validation done in cents/minor units (no decimal mismatch)
- [ ] Tax and invoice calculations validated with accountant

## 3) Domain and Security
- [ ] Domain DNS points to production hosting
- [ ] HTTPS certificate active
- [ ] HTTP -> HTTPS redirect verified
- [ ] Security headers verified (X-Frame-Options, nosniff, etc.)
- [ ] Production env variables loaded from secure secret manager
- [ ] Backup strategy defined:
  - [ ] DB daily backup
  - [ ] Backup retention policy
  - [ ] Restore drill tested at least once

## 4) Operations and Team
- [ ] Roles and permissions reviewed in admin panel
- [ ] Incident playbook created:
  - [ ] duplicated order
  - [ ] missing order
  - [ ] platform outage
  - [ ] payment mismatch
- [ ] Kitchen and cashier training completed
- [ ] Peak-hour simulation executed (Friday/Saturday dinner volume)

## 5) Legal and Compliance
- [ ] Privacy policy published
- [ ] Terms and conditions published
- [ ] Cookie policy published
- [ ] Cookie consent enabled and working
- [ ] Legal business data visible in website footer/legal page

## 6) Web Quality
- [ ] Responsive QA on real devices (iOS + Android)
- [ ] Core pages tested with Lighthouse (mobile + desktop)
- [ ] SEO minimum verified:
  - [ ] title + description per main page
  - [ ] favicon
  - [ ] Open Graph tags
  - [ ] robots/sitemap/indexing
- [ ] Image optimization verified (no oversized assets)

## 7) Go-Live Command Sequence
1. Deploy to production environment
2. Run DB migration
3. Seed required data
4. Verify health endpoints
5. Verify webhooks from all delivery providers
6. Run first manual sync from admin panel
7. Process one real checkout payment
8. Open launch window

## 8) Post Launch Monitoring (first 72h)
- [ ] Monitor webhook errors every 2-3h
- [ ] Monitor payment failures
- [ ] Monitor order state transitions
- [ ] Monitor runtime/application logs
- [ ] Confirm backup job runs successfully
