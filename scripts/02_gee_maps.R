# plotting daily maps of AET derived with developed model
# in Google Earth Engine.
library(tidyverse)
library(data.table)
library(sf)
library(raster)
library(terrainr)
library(ggnewscale)
library(ggspatial)
library(scales)
theme_set(theme_bw())

# reading synoptic station data
df_synpt <- fread("data/synoptic_data_etr.csv")

# reading gee results
etrf_paths <- list.files("data/gee", full.names = TRUE, pattern = "\\.tif$")
etrf_series <- raster::stack(etrf_paths)
et_day <- calc(etrf_series, function(x) x * df_synpt$etr_mm_per_day)

# constructing data frame for plotting
etday_df <- as.data.frame(et_day, xy = TRUE)
colnames(etday_df) <- c("x", "y",
                        stamp_date("June 19, 2016")(mdy(df_synpt$date_image)))
etday_df <- etday_df %>%
  pivot_longer(cols = c(3:14), 
               names_to = "date", values_to = "et_mm_day") %>%
  mutate(date = ordered(date, levels = colnames(etday_df)[3:14]))

# plotting
plt <- ggplot() +
  geom_raster(data = etday_df, aes(x = x, y = y, fill = et_mm_day)) +
  scale_fill_viridis_c(option = "D", na.value = "grey50", guide = "colourbar") +
  scale_x_continuous(
    limits = c(min(etday_df$x), max(etday_df$x)),
    expand = c(0, 0), 
  ) +
  scale_y_continuous(
    limits = c(min(etday_df$y), max(etday_df$y)),
    expand = c(0, 0)
  ) +
  labs(x = "", y = "", fill = "AET [mm/day]") +
  theme_void() +
  facet_wrap(vars(date), nrow = 4, ncol = 3)

ggsave("figures/gee_daily_aet.pdf", plt, width = 8, height = 12, units = "in")

