# plotting Urmia Lake Basin located in northwest of Iran
library(tidyverse)
library(sf)
library(raster)
library(terrainr)
library(ggnewscale)
library(ggspatial)
library(scales)
theme_set(theme_bw())

# reading data
agg_area <- st_read("data/agricultural_area/urmia_agricultural_region.shp")
landsat_img <- raster::stack("data/gee/variables/surfaceReflectance.tif",
                             bands = c(6, 5, 4))
landsatdf <- as.data.frame(landsat_img, xy = TRUE)

# re-scaling bands between 0 and 1
landsatdf$B6 <- rescale(landsatdf$B6, to = c(0, 1))
landsatdf$B5 <- rescale(landsatdf$B5, to = c(0, 1))
landsatdf$B4 <- rescale(landsatdf$B4, to = c(0, 1))
landsatdf <- landsatdf %>%
  mutate(fill_col = rgb(r = B6, g = B5, b = B4,
                        maxColorValue = 1))
  
# plotting
plt1 <- ggplot() +
  geom_raster(data = landsatdf, aes(x = x, y = y, fill = fill_col)) +
  scale_fill_identity() +
  geom_sf(data = agg_area, fill = NA, aes(color = "agg_area")) +
  scale_color_manual(values = c("agg_area" = "black"), 
                     labels = c('Agricultural\nregion')) +
  annotation_north_arrow(location = "tr",
                         which_north = "true") +
  annotation_scale() +
  scale_x_continuous(limits = c(min(landsatdf$x), max(landsatdf$x)),
                     expand = c(0, 0)) +
  scale_y_continuous(limits = c(min(landsatdf$y), max(landsatdf$y)),
                     expand = c(0, 0)) +
  labs(x = "", y = "", color = "")

ggsave("figures/study_region.pdf", plt1, width = 5, height = 5, units = "in")

# crop raster based on agricultural region
agg_area_landsat <- crop(landsat_img, agg_area)
agg_area_df <- as.data.frame(agg_area_landsat, xy = TRUE)

# re-scaling bands between 0 and 1
agg_area_df$B6 <- rescale(agg_area_df$B6, to = c(0, 1))
agg_area_df$B5 <- rescale(agg_area_df$B5, to = c(0, 1))
agg_area_df$B4 <- rescale(agg_area_df$B4, to = c(0, 1))
agg_area_df <- agg_area_df %>%
  mutate(fill_col = rgb(r = B6, g = B5, b = B4,
                        maxColorValue = 1))

# plotting
plt2 <- ggplot() +
  geom_raster(data = agg_area_df, aes(x = x, y = y, fill = fill_col)) +
  scale_fill_identity() +
  geom_sf(data = agg_area, fill = NA, color = "black") +
  scale_x_continuous(
    limits = c(min(agg_area_df$x), max(agg_area_df$x)),
    expand = c(0, 0), 
    breaks = c(45.0, 45.1, 45.2, 45.3)
  ) +
  scale_y_continuous(limits = c(min(agg_area_df$y), max(agg_area_df$y)),
                     expand = c(0, 0)) +
  labs(x = "", y = "", color = "")

ggsave("figures/agg_region.pdf", plt2, width = 4, height = 5, units = "in")
