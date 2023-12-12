# plotting WaPOR (developed AET framework by FAO) results for 2016
library(tidyverse)
library(data.table)
library(sf)
library(raster)
library(terrainr)
library(ggnewscale)
library(ggspatial)
library(scales)
theme_set(theme_bw())

# reading WaPOR results
wapor_paths <- list.files("data/wapor", full.names = TRUE, pattern = "\\.tif$")
wapor_series <- raster::stack(wapor_paths)
facet_names <- sapply(
  wapor_paths, 
  function(x) paste0(
    "Mean in 2016 (",
    lubridate::month(ymd(substr(basename(x), 6, 13)), label = TRUE),
    " ",
    substr(basename(x), 12, 13),
    " - ",
    lubridate::month(ymd(substr(basename(x), 15, 22)), label = TRUE),
    " ",
    substr(basename(x), 21, 22),
    ")"
  )
)
names(facet_names) <- names(wapor_series)

# constructing data frame for plotting
wapor_df <- as.data.frame(wapor_series, xy = TRUE) %>%
  pivot_longer(cols = c(3:14), 
               names_to = "date", values_to = "et_mm_day") %>%
  mutate(date = ordered(date, levels = names(wapor_series)))

# plotting
plt <- ggplot() +
  geom_raster(data = wapor_df, aes(x = x, y = y, fill = et_mm_day)) +
  scale_fill_viridis_c(option = "D", na.value = "grey50", guide = "colourbar") +
  scale_x_continuous(
    limits = c(min(wapor_df$x), max(wapor_df$x)),
    expand = c(0, 0), 
  ) +
  scale_y_continuous(
    limits = c(min(wapor_df$y), max(wapor_df$y)),
    expand = c(0, 0)
  ) +
  labs(x = "", y = "", fill = "AET [mm/day]") +
  theme_void() +
  facet_wrap(vars(date), nrow = 4, ncol = 3,
             labeller = as_labeller(facet_names))

ggsave("figures/wapor_mean_dekadal_aet.pdf", plt, 
       width = 8, height = 12, units = "in")
