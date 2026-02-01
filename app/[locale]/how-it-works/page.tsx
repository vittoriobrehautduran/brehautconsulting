'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'
import { SERVICES } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

const SERVICE_DETAILS = [
  {
    title: SERVICES[0].title,
    label: 'Core Foundation',
    description: SERVICES[0].description,
    details: [
      'Custom website design and development tailored to your brand and business goals',
      'Modern web applications built with scalable architectures and best practices',
      'Responsive design ensuring optimal experience across all devices',
      'Performance optimization for fast loading times and smooth user experience',
      'Content management systems for easy content updates and maintenance',
      'E-commerce solutions for online stores and digital marketplaces',
    ],
    benefits: [
      'Improved user engagement and conversion rates',
      'Enhanced brand presence and credibility',
      'Scalable solutions that grow with your business',
      'Modern technology stack for future-proof development',
    ],
  },
  {
    title: SERVICES[1].title,
    description: SERVICES[1].description,
    details: [
      'Conversion rate optimization (CRO) strategies and implementation',
      'Lead generation system design and optimization',
      'User experience (UX) analysis and improvements',
      'A/B testing and data-driven optimization',
      'Landing page optimization for higher conversion rates',
      'Funnel analysis and optimization at every stage',
    ],
    benefits: [
      'Higher conversion rates from existing traffic',
      'More qualified leads and better lead quality',
      'Improved ROI on marketing investments',
      'Data-driven decision making for continuous improvement',
    ],
  },
  {
    title: SERVICES[2].title,
    description: SERVICES[2].description,
    details: [
      'Technical SEO optimization for better search engine visibility',
      'Local SEO strategies for location-based businesses',
      'Keyword research and content optimization',
      'On-page and off-page SEO implementation',
      'Google Business Profile optimization',
      'SEO audits and performance tracking',
    ],
    benefits: [
      'Increased organic traffic and visibility',
      'Better rankings in search engine results',
      'More qualified leads from search',
      'Long-term sustainable growth in online presence',
    ],
  },
  {
    title: SERVICES[3].title,
    label: 'Growth Driver',
    description: SERVICES[3].description,
    details: [
      'Search engine advertising (Google Ads, Bing Ads)',
      'Social media advertising (Meta, LinkedIn, etc.)',
      'Display and retargeting campaigns',
      'Video advertising strategies',
      'Campaign setup, optimization, and management',
      'Conversion tracking and ROI optimization',
    ],
    benefits: [
      'Immediate visibility and traffic generation',
      'Precise targeting to reach your ideal customers',
      'Measurable results with clear ROI tracking',
      'Flexible budgets and scalable campaigns',
    ],
  },
  {
    title: SERVICES[4].title,
    label: 'Growth Driver',
    description: SERVICES[4].description,
    details: [
      'Analytics setup and configuration (Google Analytics, etc.)',
      'Custom dashboard creation for key metrics',
      'Conversion tracking and goal configuration',
      'Customer behavior analysis and insights',
      'Performance reporting and data visualization',
      'Data integration across multiple platforms',
    ],
    benefits: [
      'Clear visibility into business performance',
      'Data-driven insights for decision making',
      'Better understanding of customer behavior',
      'Optimization opportunities identified through data',
    ],
  },
  {
    title: SERVICES[5].title,
    description: SERVICES[5].description,
    details: [
      'API integrations between platforms and tools',
      'Workflow automation to reduce manual work',
      'CRM and marketing tool integrations',
      'Data synchronization across systems',
      'Custom integration development',
      'Process automation and efficiency improvements',
    ],
    benefits: [
      'Reduced manual work and increased efficiency',
      'Improved data accuracy and consistency',
      'Seamless workflows across platforms',
      'Time and cost savings through automation',
    ],
  },
]

export default function ServicesPage() {
  const introRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const whoForRef = useRef<HTMLDivElement>(null)
  const systemIntroRef = useRef<HTMLDivElement>(null)
  const engagementRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const serviceCardsRefs = useRef<(HTMLElement | null)[]>([])
  const sidebarRef = useRef<HTMLElement>(null)
  const [activeSection, setActiveSection] = useState<number>(0)
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro text animation
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: introRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // How It Works section animation
      if (howItWorksRef.current) {
        gsap.fromTo(
          howItWorksRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: howItWorksRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Who For section animation
      if (whoForRef.current) {
        gsap.fromTo(
          whoForRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: whoForRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // System intro animation
      if (systemIntroRef.current) {
        gsap.fromTo(
          systemIntroRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: systemIntroRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Engagement models animation
      if (engagementRef.current) {
        gsap.fromTo(
          engagementRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: engagementRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Services cards animation and scroll spy
      if (servicesRef.current) {
        const serviceCards = servicesRef.current.querySelectorAll('.service-card')
        const firstServiceCard = serviceCards[0]
        
        // Sidebar fade-in when first service card enters viewport
        if (firstServiceCard && sidebarRef.current) {
          ScrollTrigger.create({
            trigger: firstServiceCard,
            start: 'top 80%',
            onEnter: () => {
              gsap.to(sidebarRef.current, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
              })
            },
            onLeaveBack: () => {
              gsap.to(sidebarRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
              })
            },
          })
        }
        
        serviceCards.forEach((card: any, index: number) => {
          gsap.fromTo(
            card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
              delay: index * 0.1,
            }
          )

          // Scroll spy for active section
          ScrollTrigger.create({
            trigger: card,
            start: 'top 20%',
            end: 'bottom 20%',
            onEnter: () => setActiveSection(index),
            onEnterBack: () => setActiveSection(index),
          })
        })
      }
    })

    return () => {
      ctx.revert()
    }
  }, [])

  const scrollToService = (index: number) => {
    const card = serviceCardsRefs.current[index]
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(index)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <AnimatedBackground />
      <div className="relative min-h-screen flex w-full max-w-full overflow-x-hidden">
        {/* Fixed Left Navigation */}
        <aside ref={sidebarRef} className="hidden lg:block fixed left-0 top-0 h-screen w-64 pt-32 pb-8 px-6 z-40" style={{ opacity: 0 }}>
          <nav className="sticky top-32">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">
                Services
              </h3>
              <ul className="space-y-2">
                {SERVICE_DETAILS.map((service, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToService(index)}
                      className="w-full text-left px-4 py-3 rounded-lg transition-all duration-500 relative group"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`text-xs font-semibold w-6 flex-shrink-0 transition-colors duration-500 pt-0.5 ${
                          activeSection === index ? 'text-blue-400' : 'text-white/40'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-xs font-medium leading-relaxed flex-1 transition-all duration-500 ${
                          activeSection === index
                            ? 'text-white'
                            : 'text-white/60 group-hover:text-white/90'
                        }`}>
                          {service.title}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 lg:mr-64 w-full min-w-0">
        {/* Hero Section - Short positioning intro */}
        <section className="min-h-[50vh] flex items-center justify-center px-4 sm:px-6 pt-32 pb-16">
          <div className="w-full max-w-4xl mx-auto text-center">
            <div ref={introRef} className="space-y-4 max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                Brehaut Consulting helps businesses get more customers by building clear, measurable digital systems.
              </p>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                The focus is on understanding how customers find you, how they decide to contact you, and how your digital setup supports that journey.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section ref={howItWorksRef} className="py-20 px-4 sm:px-6 relative z-10">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="glow-title text-4xl md:text-5xl font-heading font-bold mb-6 text-white text-center">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-white/80 text-center mb-12 max-w-2xl mx-auto">
              If this approach makes sense,{' '}
              <Link href="/booking" className="text-white underline underline-offset-4 decoration-white/50 hover:decoration-white transition-colors">
                the next step is a short conversation
              </Link>
              .
            </p>
            <div className="space-y-16 max-w-3xl mx-auto">
              {[
                {
                  number: '1',
                  title: 'Initial Conversation',
                  description: 'We start with a working session to understand your business, customers, and what\'s actually preventing more enquiries or customers.',
                },
                {
                  number: '2',
                  title: 'System Design',
                  description: 'Based on your situation, a clear digital system is defined — only what\'s needed, based on your goals and situation.',
                },
                {
                  number: '3',
                  title: 'Build & Implementation',
                  description: 'The agreed components are designed and implemented with a focus on performance, clarity, and long-term reliability.',
                },
                {
                  number: '4',
                  title: 'Measurement & Improvement',
                  description: 'Results are tracked and reviewed so the system can be improved over time based on real data.',
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex gap-6 md:gap-8"
                >
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold text-white/90">{step.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who This Is For / Not For Section */}
        <section ref={whoForRef} className="py-20 px-4 sm:px-6 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              {/* Who This Is For */}
              <div>
                <h2 className="glow-text text-3xl md:text-4xl font-heading font-bold mb-8 text-white">
                  Who This Is For
                </h2>
                <ul className="space-y-4">
                  {[
                    'Businesses that want more enquiries, bookings, or customers',
                    'Owners who care about results, not just design',
                    'Companies that want clarity instead of guesswork',
                    'Businesses open to improving how their digital presence works',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4 text-lg text-white/90 leading-relaxed">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-500/30 to-green-600/30 border border-green-400/40 flex items-center justify-center mt-1">
                        <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Who This Is Not For */}
              <div>
                <h2 className="glow-text text-3xl md:text-4xl font-heading font-bold mb-8 text-white">
                  Who This Is Not For
                </h2>
                <ul className="space-y-4">
                  {[
                    'Businesses looking for the cheapest possible solution',
                    'One-off tasks with no interest in long-term results',
                    'Clients who want tools without strategy',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4 text-lg text-white/90 leading-relaxed">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/30 border border-red-400/40 flex items-center justify-center mt-1">
                        <svg className="w-4 h-4 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Link
                href="/booking"
                className="glow-button inline-block px-10 py-4 bg-white text-black rounded-full text-lg font-semibold hover:bg-white/90 shadow-2xl"
              >
                Book a Meeting
              </Link>
            </div>
          </div>
        </section>

        {/* The Digital Growth System Intro */}
        <section ref={systemIntroRef} className="py-16 px-4 sm:px-6 relative z-10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="glow-title text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              The Digital Growth System
            </h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Each system is built from the components below. Not every business needs every part, but each component exists to support one goal: measurable customer growth.
            </p>
          </div>
        </section>

        {/* Mobile Navigation - Sticky at top */}
        <nav className="lg:hidden sticky top-20 z-30 bg-black/70 backdrop-blur-md border-t border-b border-white/15 py-2.5">
          <div className="flex gap-1.5 justify-center px-2">
            {SERVICE_DETAILS.map((service, index) => (
              <button
                key={index}
                onClick={() => scrollToService(index)}
                aria-label={`${service.title} - Service ${index + 1}`}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center ${
                  activeSection === index
                    ? 'bg-white/20 text-white shadow-lg scale-110'
                    : 'bg-white/8 text-white/70 hover:bg-white/12 hover:text-white/90'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </nav>

        {/* Services Details Section */}
        <section ref={servicesRef} className="py-20 px-2 sm:px-3 relative z-10">
          <div className="container mx-auto max-w-none">
            <p className="text-lg md:text-xl text-white/70 text-center mb-12 max-w-3xl mx-auto px-4">
              Below are the core components that can make up your digital growth system.
            </p>
            <div className="space-y-16 sm:space-y-24">
              {SERVICE_DETAILS.map((service, index) => (
                <article 
                  key={index} 
                  ref={(el) => {
                    serviceCardsRefs.current[index] = el
                  }}
                  className="service-card scroll-mt-36 lg:scroll-mt-0"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-black/60 via-black/70 to-black/60 border border-white/20 rounded-2xl p-8 lg:p-16 backdrop-blur-md hover:border-white/30 transition-all duration-300 shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                      {/* Header with number badge */}
                      <header className="mb-8">
                        <div className="flex items-start justify-between gap-4 sm:gap-6 mb-6">
                          <div className="flex-1">
                            <div className="inline-block mb-4">
                              <span className="text-sm font-semibold text-blue-400/80 uppercase tracking-wider">
                                Service {index + 1}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-3 flex-wrap">
                              <h2 className="glow-text text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
                                {service.title}
                              </h2>
                              {service.label && (
                                <span className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                                  ({service.label})
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center mt-2 sm:mt-0">
                            <span className="text-2xl lg:text-3xl font-bold text-white/70">{index + 1}</span>
                          </div>
                        </div>
                      </header>

                      {/* Content grid - blog style layout */}
                      <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 mt-12">
                        {/* What We Do - takes 2 columns */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                            <h3 className="text-3xl font-heading font-bold text-white">
                              What We Do
                            </h3>
                          </div>
                          <ul className="space-y-6">
                            {service.details.map((detail, detailIndex) => (
                              <li
                                key={detailIndex}
                                className="flex items-start gap-5 text-white/90 leading-relaxed"
                              >
                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-blue-400/40 flex items-center justify-center mt-1">
                                  <svg
                                    className="w-4 h-4 text-blue-300"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <span className="text-lg lg:text-xl leading-relaxed">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Benefits - takes 1 column */}
                        <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-12">
                          <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
                            <h3 className="text-3xl font-heading font-bold text-white">
                              Benefits
                            </h3>
                          </div>
                          <ul className="space-y-6">
                            {service.benefits.map((benefit, benefitIndex) => (
                              <li
                                key={benefitIndex}
                                className="flex items-start gap-5 text-white/90 leading-relaxed"
                              >
                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-400/40 flex items-center justify-center mt-1">
                                  <svg
                                    className="w-4 h-4 text-purple-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                  </svg>
                                </div>
                                <span className="text-lg lg:text-xl leading-relaxed">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Ways to Work Together Section */}
        <section ref={engagementRef} className="py-20 px-4 sm:px-6 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="glow-title text-4xl md:text-5xl font-heading font-bold mb-8 text-white text-center">
              Ways to Work Together
            </h2>
            <div className="bg-black/40 border border-white/20 rounded-2xl p-8 lg:p-12 backdrop-blur-sm">
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 text-center">
                Some clients need a complete system. Others need a specific component.
              </p>
              <p className="text-lg md:text-xl text-white/80 mb-8 text-center">
                Engagements can include:
              </p>
              <ul className="space-y-4 max-w-2xl mx-auto">
                {[
                  'Full system design and implementation',
                  'Website or web application projects',
                  'Advertising setup and optimisation',
                  'Analytics and tracking architecture',
                  'Ongoing optimisation and support',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4 text-lg text-white/90 leading-relaxed">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-blue-400/40 flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mt-8 text-center">
                The scope is defined after the initial conversation, based on what will create the most value for your business.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pt-32 pb-48 px-6 relative z-10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="glow-title text-4xl md:text-5xl font-heading font-bold mb-8 text-white">
              Next Step
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              If this sounds relevant, the next step is a short meeting to understand your business and see if there&apos;s a good fit.
            </p>
            <Link
              href="/booking"
              className="glow-button inline-block px-10 py-4 bg-white text-black rounded-full text-lg font-semibold hover:bg-white/90 shadow-2xl"
            >
              Book a Meeting
            </Link>
          </div>
        </section>

        {/* Mobile Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="lg:hidden fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-11 h-11 bg-black/50 backdrop-blur-md border border-white/5 rounded-full flex items-center justify-center text-white/50 hover:text-white/70 hover:border-white/10 transition-all duration-300 group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-y-0.5 transition-transform animate-jump-periodic"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
        </div>
      </div>
    </>
  )
}

