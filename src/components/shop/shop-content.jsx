'use client'
import React,{ useState, useEffect } from 'react';
import Pagination from "@/ui/Pagination";
import ProductItem from "../products/fashion/product-item";
import PriceFilter from "./shop-filter/price-filter";
import StatusFilter from "./shop-filter/status-filter";
import ShopListItem from "./shop-list-item";
import ShopTopLeft from "./shop-top-left";
import ShopTopRight from "./shop-top-right";
import ResetButton from "./shop-filter/reset-button";
import ShopSidebarFilters from "./ShopSidebarFilters";
import PopularProductImages from "@/components/products/fashion/popular-product-images";
import WeeksFeaturedImages from "@/components/products/fashion/weeks-featured-images";
import { useGetPopularNewProductsQuery, useGetTopRatedQuery } from "@/redux/features/newProductApi";

const ShopContent = ({all_products = [], products = [], otherProps, shop_right, hidden_sidebar}) => {
  const {priceFilterValues, selectHandleFilter, currPage, setCurrPage, selectedFilters, handleFilterChange} = otherProps;
  const {setPriceValue} = priceFilterValues || {};
  const [filteredRows, setFilteredRows] = useState(products);
  const [pageStart, setPageStart] = useState(0);
  const [countOfPage, setCountOfPage] = useState(12);

  // Fetch popular and top-rated products
  const { data: popularProductsData, isLoading: isLoadingPopular } = useGetPopularNewProductsQuery();
  const { data: topRatedData, isLoading: isLoadingTopRated } = useGetTopRatedQuery();

  const popularProducts = popularProductsData?.data || [];
  const topRatedProducts = topRatedData?.data || [];

  const paginatedData = (items, startPage, pageCount) => {
    setFilteredRows(items);
    setPageStart(startPage);
    setCountOfPage(pageCount);
  };

  // max price with validation
  const maxPrice = all_products.reduce((max, product) => {
    const price = Number(product?.salesPrice) || 0;
    return price > max ? price : max;
  }, 1000); // Default to 1000 if no products or all prices are 0

  return (
    <>
     <section className="tp-shop-area pb-120">
        <div className="container">
          <div className="row">
            {!shop_right && !hidden_sidebar && (
              <div className="col-xl-3 col-lg-4 d-none d-lg-block">
                <div className="tp-shop-sidebar mr-10">
                  <PriceFilter priceFilterValues={priceFilterValues} maxPrice={maxPrice} />
                  <StatusFilter setCurrPage={setCurrPage} />
                  <ShopSidebarFilters 
                    onFilterChange={handleFilterChange} 
                    selected={selectedFilters} 
                  />
                  <ResetButton setPriceValues={setPriceValue} maxPrice={maxPrice} handleFilterChange={handleFilterChange} />
                  
                  {/* Popular Products */}
                  <div className="tp-shop-widget mb-30">
                    <div className="tp-shop-widget-title">
                      <h3 className="tp-shop-widget-title">Popular Products</h3>
                    </div>
                    <PopularProductImages 
                      products={popularProducts.map(item => item.product)} 
                      loading={isLoadingPopular} 
                    />
                  </div>
                  
                  {/* Top Rated Products */}
                  <div className="tp-shop-widget mb-30">
                    <div className="tp-shop-widget-title">
                      <h3 className="tp-shop-widget-title">Top Rated Products</h3>
                    </div>
                    <WeeksFeaturedImages 
                      products={topRatedProducts.map(item => item.product)} 
                      loading={isLoadingTopRated} 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className={`${hidden_sidebar ? 'col-xl-12 col-lg-12' : 'col-xl-9 col-lg-8 col-12'}`}>
              <div className="tp-shop-main-wrapper">
                <div className="tp-shop-top mb-45">
                  <div className="row">
                    <div className="col-xl-6">
                      <ShopTopLeft
                        showing={
                          products.length === 0
                            ? 0
                            : filteredRows.slice(
                                pageStart,
                                pageStart + countOfPage
                              ).length
                        }
                        total={all_products.length}
                      />
                    </div>
                    <div className="col-xl-6">
                      <ShopTopRight selectHandleFilter={selectHandleFilter} />
                    </div>
                  </div>
                </div>
                {products.length === 0 && <h2>No products found</h2>}
                {products.length > 0 && (
                  <div className="tp-shop-items-wrapper tp-shop-item-primary">
                    <div className="tab-content" id="productTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="grid-tab-pane"
                        role="tabpanel"
                        aria-labelledby="grid-tab"
                        tabIndex="0"
                      >
                        <div className="row">
                          {filteredRows
                            .slice(pageStart, pageStart + countOfPage)
                            .map((item,i) => (
                              <div
                                key={i}
                                className="col-xl-4 col-md-6 col-sm-6"
                              >
                                <ProductItem product={item} />
                              </div>
                            ))}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="list-tab-pane"
                        role="tabpanel"
                        aria-labelledby="list-tab"
                        tabIndex="0"
                      >
                        <div className="tp-shop-list-wrapper tp-shop-item-primary mb-70">
                          <div className="row">
                            <div className="col-xl-12">
                              {filteredRows
                                .slice(pageStart, pageStart + countOfPage)
                                .map((item,i) => (
                                  <ShopListItem key={i} product={item} />
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {products.length > 0 && (
                  <div className="tp-shop-pagination mt-20">
                    <div className="tp-pagination">
                      <Pagination
                        items={products}
                        countOfPage={12}
                        paginatedData={paginatedData}
                        currPage={currPage}
                        setCurrPage={setCurrPage}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {shop_right && (
              <div className="col-xl-3 col-lg-4 d-none d-lg-block">
                <div className="tp-shop-sidebar mr-10">
                  <PriceFilter priceFilterValues={priceFilterValues} maxPrice={maxPrice} />
                  <StatusFilter setCurrPage={setCurrPage} />
                  <ShopSidebarFilters 
                    onFilterChange={handleFilterChange} 
                    selected={selectedFilters} 
                  />
                  <ResetButton setPriceValues={setPriceValue} maxPrice={maxPrice} handleFilterChange={handleFilterChange} />
                  <PopularProductImages 
                    products={popularProducts.map(item => item.product)} 
                    loading={isLoadingPopular} 
                  />
                  <WeeksFeaturedImages 
                    products={topRatedProducts.map(item => item.product)} 
                    loading={isLoadingTopRated} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section> 
    </>
  );
};

export default ShopContent;