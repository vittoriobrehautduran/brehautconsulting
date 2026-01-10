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
  const titleRef = useRef<HTMLHeadingElement>(null)
  const introRef = useRef<HTMLParagraphElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const serviceCardsRefs = useRef<(HTMLElement | null)[]>([])
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
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

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

      // Services cards animation and scroll spy
      if (servicesRef.current) {
        const serviceCards = servicesRef.current.querySelectorAll('.service-card')
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
        <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 pt-32 pb-8 px-6 z-40">
          <nav className="sticky top-32">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">
                Services
              </h3>
              <ul className="space-y-2">
                {SERVICE_DETAILS.map((service, index) => {
                  // Shorten service titles for navigation
                  const shortTitle = service.title
                    .replace('Website & Web Application ', '')
                    .replace('Conversion & Lead ', '')
                    .replace('Local Visibility & ', '')
                    .replace('Advertising & Demand ', '')
                    .replace('Analytics & ', '')
                    .replace('Technical Integrations & ', '')
                    .split(' ')[0] + (service.title.includes('&') ? ' & More' : '')
                  
                  return (
                    <li key={index}>
                      <button
                        onClick={() => scrollToService(index)}
                        className="w-full text-left px-4 py-3 rounded-lg transition-all duration-500 relative group"
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-semibold w-6 transition-colors duration-500 ${
                            activeSection === index ? 'text-blue-400' : 'text-white/40'
                          }`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className={`text-sm font-medium leading-tight flex-1 transition-all duration-500 ${
                            activeSection === index
                              ? 'text-white translate-x-2'
                              : 'text-white/60 group-hover:text-white/90'
                          }`}>
                            {shortTitle}
                          </span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 w-full min-w-0">
        {/* Hero Section */}
        <section className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 pt-32 pb-20">
          <div className="container mx-auto max-w-4xl text-center">
            <h1
              ref={titleRef}
              className="glow-title text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 text-white"
            >
              Our Services
            </h1>
            <p
              ref={introRef}
              className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-6"
            >
              Comprehensive digital solutions designed to drive real business results. 
              We combine technical expertise with strategic thinking to deliver measurable outcomes.
            </p>
            <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
              These services are offered as part of focused packages and tailored systems — not as isolated tasks. The scope is adapted to each business and agreed before starting.
            </p>
          </div>
        </section>

        {/* Mobile Navigation - Sticky at top */}
        <nav className="lg:hidden sticky top-20 z-30 bg-black/70 backdrop-blur-md border-b border-white/15 py-2.5">
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
        <section ref={servicesRef} className="py-20 px-4 sm:px-6 relative z-10">
          <div className="container mx-auto max-w-7xl">
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
                        <div className="flex items-start justify-between gap-6 mb-6">
                          <div className="flex-1">
                            <div className="inline-block mb-4">
                              <span className="text-sm font-semibold text-blue-400/80 uppercase tracking-wider">
                                Service {index + 1}
                              </span>
                            </div>
                            <h2 className="glow-text text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
                              {service.title}
                            </h2>
                          </div>
                          <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center">
                            <span className="text-3xl lg:text-4xl font-bold text-white/70">{index + 1}</span>
                          </div>
                        </div>
                        
                        {/* Brief service description - like blog intro */}
                        <div className="max-w-4xl">
                          <p className="text-xl lg:text-2xl text-white/95 leading-relaxed font-light">
                            {service.description}
                          </p>
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

        {/* CTA Section */}
        <section className="py-32 px-6 relative z-10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="glow-title text-4xl md:text-5xl font-heading font-bold mb-8 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Let&apos;s discuss how we can help transform your digital presence and drive real business results.
            </p>
            <Link
              href="/booking"
              className="glow-button inline-block px-10 py-4 bg-white text-black rounded-full text-lg font-semibold hover:bg-white/90 shadow-2xl"
            >
              Book a Consultation
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

