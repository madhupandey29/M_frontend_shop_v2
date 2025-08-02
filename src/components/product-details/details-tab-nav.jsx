'use client';
import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { useGetStructureQuery } from '@/redux/features/structureApi';
import { useGetContentByIdQuery } from '@/redux/features/contentApi';
import { useGetFinishByIdQuery } from '@/redux/features/finishApi';
import { useGetDesignByIdQuery } from '@/redux/features/designApi';
import { useGetMotifSizeByIdQuery } from '@/redux/features/motifSizeApi';
import { useGetSuitableForByIdQuery } from '@/redux/features/suitableForApi';

const DetailsTabNav = ({ product, seoData }) => {
  // Refs
  const activeRef = useRef(null);
  const marker = useRef(null);

  // Extract product data with default values
  const {
    description,
    oz, 
    productIdentifier,
    structureId = '', 
    contentId = '', 
    finishId = '', 
    designId = '', 
    motifsizeId = '', 
    suitableforId = ''
  } = product || {};

  // API calls with error handling and logging
  const { data: structureData, error: structureError } = useGetStructureQuery(
    structureId, 
    { skip: !structureId || String(structureId).trim() === '' }
  );
  
  const { data: contentData, error: contentError } = useGetContentByIdQuery(
    contentId, 
    { skip: !contentId || String(contentId).trim() === '' }
  );
  
  const { data: finishData, error: finishError } = useGetFinishByIdQuery(
    finishId, 
    { skip: !finishId || String(finishId).trim() === '' }
  );
  
  const { data: designData, error: designError } = useGetDesignByIdQuery(
    designId, 
    { skip: !designId || String(designId).trim() === '' }
  );
  
  const { data: motifsizeData } = useGetMotifSizeByIdQuery(
    motifsizeId, 
    { skip: !motifsizeId || String(motifsizeId).trim() === '' }
  );
  
  const { data: suitableforData } = useGetSuitableForByIdQuery(
    suitableforId, 
    { skip: !suitableforId || String(suitableforId).trim() === '' }
  );

  // Debug logs
  useEffect(() => {
    if (!product) {
      console.log('No product data received');
      return;
    }
    
    console.log('SEO Data in DetailsTabNav:', seoData);
    console.log('Product in DetailsTabNav:', product);
    console.log('Extracted IDs:', { 
      structureId, 
      contentId, 
      finishId, 
      designId, 
      motifsizeId, 
      suitableforId 
    });
  }, [product, seoData, structureId, contentId, finishId, designId, motifsizeId, suitableforId]);

  // Log API responses and errors
  useEffect(() => {
    if (!product) return;
    
    if (structureData) console.log('Structure Data:', structureData);
    if (structureError) console.error('Structure Error:', structureError);
    if (contentData) console.log('Content Data:', contentData);
    if (contentError) console.error('Content Error:', contentError);
    if (finishData) console.log('Finish Data:', finishData);
    if (finishError) console.error('Finish Error:', finishError);
    if (designData) console.log('Design Data:', designData);
    if (designError) console.error('Design Error:', designError);
  }, [
    product,
    structureData, structureError,
    contentData, contentError,
    finishData, finishError,
    designData, designError
  ]);

  // Memoize SEO items
  const seoItems = useMemo(() => {
    if (!seoData) return [];
    
    return [
      // Basic SEO
      seoData.title && { label: "Title", value: seoData.title },
      seoData.description && { label: "Description", value: seoData.description },
      seoData.keywords && { label: "Keywords", value: seoData.keywords },
      seoData.canonical_url && { label: "Canonical URL", value: seoData.canonical_url },
      seoData.slug && { label: "Slug", value: seoData.slug },
      seoData.productIdentifier && { label: "Product Identifier", value: seoData.productIdentifier },
      seoData.sku && { label: "SKU", value: seoData.sku },
      
      // Meta Tags
      seoData.robots && { label: "Robots", value: seoData.robots },
      seoData.viewport && { label: "Viewport", value: seoData.viewport },
      seoData.themeColor && { label: "Theme Color", value: seoData.themeColor },
      seoData.contentLanguage && { label: "Content Language", value: seoData.contentLanguage },
      seoData.googleSiteVerification && { label: "Google Site Verification", value: seoData.googleSiteVerification },
      
      // Open Graph
      seoData.ogTitle && { label: "OG Title", value: seoData.ogTitle },
      seoData.ogDescription && { label: "OG Description", value: seoData.ogDescription },
      seoData.ogUrl && { label: "OG URL", value: seoData.ogUrl },
      seoData.ogSiteName && { label: "OG Site Name", value: seoData.ogSiteName },
      seoData.ogType && { label: "OG Type", value: seoData.ogType },
      seoData.ogLocale && { label: "OG Locale", value: seoData.ogLocale },
      
      // Twitter Card
      seoData.twitterCard && { label: "Twitter Card", value: seoData.twitterCard },
      seoData.twitterSite && { label: "Twitter Site", value: seoData.twitterSite },
      seoData.twitterTitle && { label: "Twitter Title", value: seoData.twitterTitle },
      seoData.twitterDescription && { label: "Twitter Description", value: seoData.twitterDescription },
      
      // Additional SEO
      seoData.excerpt && { label: "Excerpt", value: seoData.excerpt },
      seoData.charset && { label: "Charset", value: seoData.charset },
      seoData.xUaCompatible && { label: "X-UA-Compatible", value: seoData.xUaCompatible },
      seoData.msValidate && { label: "MS Validate", value: seoData.msValidate },
      seoData.mobileWebAppCapable && { label: "Mobile Web App Capable", value: seoData.mobileWebAppCapable },
      seoData.appleStatusBarStyle && { label: "Apple Status Bar Style", value: seoData.appleStatusBarStyle },
      seoData.formatDetection && { label: "Format Detection", value: seoData.formatDetection },
      
      // Product Info
      seoData.purchasePrice && { label: "Purchase Price", value: seoData.purchasePrice },
      seoData.salesPrice && { label: "Sales Price", value: seoData.salesPrice },
      seoData.locationCode && { label: "Location Code", value: seoData.locationCode },
      seoData.popularproduct && { label: "Popular Product", value: seoData.popularproduct ? 'Yes' : 'No' },
      seoData.topratedproduct && { label: "Top Rated Product", value: seoData.topratedproduct ? 'Yes' : 'No' },
      
      // JSON-LD
      seoData.VideoJsonLd && { label: "Video JSON-LD", value: seoData.VideoJsonLd },
      seoData.LogoJsonLd && { label: "Logo JSON-LD", value: seoData.LogoJsonLd },
      seoData.BreadcrumbJsonLd && { label: "Breadcrumb JSON-LD", value: seoData.BreadcrumbJsonLd },
      seoData.LocalBusinessJsonLd && { label: "Local Business JSON-LD", value: seoData.LocalBusinessJsonLd },
    ].filter(Boolean);
  }, [seoData]);

  // Memoize info items and split them into two halves
  const { firstHalf, secondHalf } = useMemo(() => {
    if (!product) return { firstHalf: [], secondHalf: [] };
    
    const items = [
      structureId && structureData?.data?.name && { label: "Structure", value: structureData.data.name },
      contentId && contentData?.data?.name && { label: "Content", value: contentData.data.name },
      finishId && finishData?.data?.name && { label: "Finish", value: finishData.data.name },
      designId && designData?.data?.name && { label: "Design", value: designData.data.name },
      motifsizeId && motifsizeData?.data?.name && { label: "Motif Size", value: motifsizeData.data.name },
      suitableforId && suitableforData?.data?.name && { label: "Suitable For", value: suitableforData.data.name },
      oz && { label: "OZ", value: oz },
      productIdentifier && { label: "Product ID", value: productIdentifier },
      ...seoItems,
    ].filter(Boolean);
    
    const half = Math.ceil(items.length / 2);
    return {
      firstHalf: items.slice(0, half),
      secondHalf: items.slice(half)
    };
  }, [
    product,
    structureId, structureData,
    contentId, contentData,
    finishId, finishData,
    designId, designData,
    motifsizeId, motifsizeData,
    suitableforId, suitableforData,
    oz, productIdentifier, seoItems
  ]);

  // Handle active tab change
  const handleActive = useCallback((e) => {
    if (!e?.target?.classList?.contains('active') || !marker.current) return;
    
    marker.current.style.left = `${e.target.offsetLeft}px`;
    marker.current.style.width = `${e.target.offsetWidth}px`;
  }, []);

  // Set initial marker position
  useEffect(() => {
    if (!activeRef.current?.classList.contains('active') || !marker.current) return;
    
    marker.current.style.left = `${activeRef.current.offsetLeft}px`;
    marker.current.style.width = `${activeRef.current.offsetWidth}px`;
  }, [activeRef, marker]);

  // Memoized NavItem component
  const NavItem = React.memo(function NavItem({ active = false, id, title, linkRef }) {
    return (
      <button
        ref={linkRef}
        className={`nav-link ${active ? "active" : ""}`}
        id={`nav-${id}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#nav-${id}`}
        type="button"
        role="tab"
        aria-controls={`nav-${id}`}
        aria-selected={active ? "true" : "false"}
        tabIndex="-1"
        onClick={e => handleActive(e)}
      >
        {title}
      </button>
    );
  });
  NavItem.displayName = 'NavItem';

  // Early return if no product data
  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <>
      <div className="tp-product-details-tab-nav tp-tab">
        <nav>
          <div className="nav nav-tabs justify-content-center p-relative tp-product-tab" id="navPresentationTab" role="tablist">
            <NavItem active={true} linkRef={activeRef} id="desc" title="Description" />
            <NavItem id="additional" title="Additional information" />
            <span ref={marker} id="productTabMarker" className="tp-product-details-tab-line"></span>
          </div>
        </nav>
        <div className="tab-content" id="navPresentationTabContent">
          <div className="tab-pane fade show active" id="nav-desc" role="tabpanel" aria-labelledby="nav-desc-tab" tabIndex="-1">
            <div className="tp-product-details-desc-wrapper pt-60">
              <p>{description}</p>
            </div>
          </div>
          <div className="tab-pane fade" id="nav-additional" role="tabpanel" aria-labelledby="nav-additional-tab" tabIndex="-1">
            {!seoItems?.length ? (
              <div className="text-center py-4">No additional information available</div>
            ) : (
              <div className="tp-product-details-additional-info">
                <h4 className="mb-4">Product Information</h4>
                <div className="row">
                  <div className="col-xl-6">
                    <table className="table table-striped">
                      <tbody>
                        {firstHalf.map((item, i) => (
                          <tr key={i}>
                            <th className="w-40" style={{ whiteSpace: 'nowrap' }}>{item.label}</th>
                            <td className="w-60">
                              {Array.isArray(item.value) ? (
                                <ul className="mb-0 ps-3">
                                  {item.value.map((val, idx) => (
                                    <li key={idx}>{val}</li>
                                  ))}
                                </ul>
                              ) : (
                                item.value || '—'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-xl-6">
                    <table className="table table-striped">
                      <tbody>
                        {secondHalf.map((item, i) => (
                          <tr key={i}>
                            <th className="w-40" style={{ whiteSpace: 'nowrap' }}>{item.label}</th>
                            <td className="w-60">
                              {Array.isArray(item.value) ? (
                                <ul className="mb-0 ps-3">
                                  {item.value.map((val, idx) => (
                                    <li key={idx}>{val}</li>
                                  ))}
                                </ul>
                              ) : (
                                item.value || '—'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {seoItems.length > 0 && (
                  <div className="mt-5">
                    <h4 className="mb-4">SEO Information</h4>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          {seoItems.map((item, i) => (
                            <tr key={`seo-${i}`}>
                              <th className="w-25" style={{ whiteSpace: 'nowrap' }}>{item.label}</th>
                              <td className="w-75">
                                {Array.isArray(item.value) ? (
                                  <ul className="mb-0 ps-3">
                                    {item.value.map((val, idx) => (
                                      <li key={idx}>{val}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  item.value || '—'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsTabNav;