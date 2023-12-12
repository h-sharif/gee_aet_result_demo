# comparing GEE and WaPOR results
library(tidyverse)
library(data.table)
library(terra)
library(sf)
library(rasterVis)
library(exactextractr)
library(viridis)
library(fmsb)
theme_set(theme_bw())

# agricultural region
agg_area <- st_read("data/agricultural_area/urmia_agricultural_region.shp")

# reading WaPOR results
wapor_paths <- list.files("data/wapor", full.names = TRUE, pattern = "\\.tif$")
wapor_series <- rast(wapor_paths)
wapor_df <- as.data.frame(wapor_series, xy = TRUE)

# reading gee results
df_synpt <- fread("data/synoptic_data_etr.csv")
etrf_paths <- list.files("data/gee", full.names = TRUE, pattern = "\\.tif$")
etrf_series <- rast(etrf_paths)
et_day <- app(etrf_series, function(x) x * df_synpt$etr_mm_per_day)
etday_df <- as.data.frame(et_day, xy = TRUE)

# increasing WaPOR resolution to match gee resolution with re-sampling
# and construct a Spatial Raster Collection
rast_all = rast()
for (j in c(1:12)) {
  wapor_sampled <- terra::resample(wapor_series[[j]], et_day[[j]])
  add(rast_all) <- wapor_sampled
  add(rast_all) <- et_day[[j]]
}
names(rast_all) <- paste0(c("wapor_", "gee_"), rep(c(1:12), each = 2))

# crop layer to agricultural region
rast_all <- crop(rast_all, agg_area)

# calculating correlations on agricultural region 
df <- as.data.frame(rast_all, xy = TRUE)
df <- na.omit(df)
cormat <- numeric(12)
for (j in c(1:12)) {
  cormat[j] <- cor(df %>% pull(paste0("wapor_", j)),
                   df %>% pull(paste0("gee_", j)))
}

# visualizing correlations on agricultural region
# 1. setting levelplot parameters
my.theme <- rasterTheme(viridis_pal(option = "D")(20))
pdf("figures/wapor_vs_gee_resampled_agg_area.pdf", height = 13, width = 12)
levelplot(
  rast_all,
  scales = list(x = list(at = NULL), y = list(at = NULL)),
  names.attr = c("Jan D3 WaPOR Avg", "Jan 31 GEE",
                 "Feb D2 WaPOR Avg", "Feb 16 GEE",
                 "Mar D2 WaPOR Avg", "Mar 19 GEE",
                 "Apr D2 WaPOR Avg", "Apr 20 GEE",
                 "May D3 WaPOR Avg", "May 22 GEE",
                 "Jun D3 WaPOR Avg", "Jun 23 GEE",
                 "Jul D1 WaPOR Avg", "Jul 09 GEE",
                 "Aug D3 WaPOR Avg", "Aug 26 GEE",
                 "Sep D2 WaPOR Avg", "Sep 11 GEE",
                 "Oct D2 WaPOR Avg", "Oct 13 GEE",
                 "Nov D2 WaPOR Avg", "Nov 14 GEE",
                 "Dec D2 WaPOR Avg", "Dec 16 GEE"),
  par.settings = my.theme,
  layout = c(6, 4)
)
dev.off()

# correlation plot
plt_cor <- data.frame(m = ordered(month.abb, levels = month.abb), 
                      cor = cormat) %>%
  ggplot(aes(x = m, y = cor)) +
    geom_col(color = "black", fill = "royalblue") +
  theme(panel.grid.major.x = element_blank()) +
  labs(x = "Month of select day in 2016", y = "Pearson Correlation\nWaPOR Averaged Dekadal - GEE Daily") +
  scale_y_continuous(breaks = round(seq(-0.3, 1, by = 0.1), digits = 2))

ggsave("figures/wapor_vs_gee_resampled_agg_cor.pdf", plt_cor, 
       width = 5, height = 4, units = "in")

# comparing sum of AET on agricultural region, which sheds light on agricultural
# water use
sum_df <- exact_extract(rast_all, agg_area, "sum") %>%
  pivot_longer(cols = c(1:24),
               names_to = c("src", "month"),
               values_to = "sum_area_et",
               names_sep = "_") %>%
  mutate(src = substr(src, 5, nchar(src)),
         src = ifelse(src == "wapor", "WaPOR", "GEE"),
         month = ordered(month.abb[as.numeric(month)], levels = month.abb),
         sum_area_et = sum_area_et / 1000) 

# visualizing
plt_sum <- sum_df %>%
  ggplot(aes(x = month, y = sum_area_et, fill = src)) +
    geom_bar(position = "dodge", stat = "identity", color = "black") +
    scale_fill_manual(values = c("WaPOR" = "red", "GEE" = "blue")) +
    labs(x = "Month of select day in 2016",
         y = "Total AET over agricultural region [m/day]", 
         fill = "Model") +
  theme(panel.grid.major.x = element_blank())

ggsave("figures/wapor_vs_gee_resampled_agg_sum.pdf", plt_sum, 
       width = 6, height = 4, units = "in")
  