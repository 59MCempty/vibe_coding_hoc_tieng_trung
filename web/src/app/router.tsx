/**
 * Mọi đường dẫn của website — theo specs/001-hoc-tieng-trung-hsk/contracts/routes.md
 * Mỗi trang được tải riêng khi cần (lazy) để lần mở đầu nhẹ.
 */

import { Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom'
import { Layout } from './Layout.tsx'

/** Trang tạm "Đang xây dựng" cho route chưa làm. */
function placeholder(path: string, title: string, description: string): RouteObject {
  return {
    path,
    lazy: async () => {
      const { default: PlaceholderPage } = await import('../pages/PlaceholderPage.tsx')
      return { Component: () => <PlaceholderPage title={title} description={description} /> }
    },
  }
}

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      // TẠM THỜI (T043): bản MVP mở ra là học được ngay. Bỏ dòng này khi làm trang chủ (T094).
      { path: '/', element: <Navigate to="/lo-trinh/hsk1" replace /> },

      {
        path: '/lo-trinh/:stageId',
        lazy: async () => ({ Component: (await import('../pages/StagePage.tsx')).default }),
      },
      {
        path: '/bai/:lessonId',
        lazy: async () => ({ Component: (await import('../pages/LessonPage.tsx')).default }),
      },

      placeholder(
        '/kiem-tra-trinh-do',
        'Kiểm tra trình độ',
        'Một bài kiểm tra ngắn để gợi ý bạn nên bắt đầu từ cấp nào.',
      ),
      placeholder(
        '/hoc',
        'Hôm nay',
        'Mục tiêu trong ngày, chuỗi ngày học, số thẻ cần ôn và bài tiếp theo của bạn.',
      ),
      placeholder('/lo-trinh', 'Lộ trình', 'Các chặng học từ Pinyin tới HSK 6, mở khoá dần theo tiến độ.'),
      placeholder('/pinyin', 'Pinyin và thanh điệu', 'Học cách đọc phiên âm và 4 thanh điệu của tiếng Trung.'),
      placeholder('/on-tap', 'Ôn tập', 'Ôn lại các từ đã học đúng lúc sắp quên.'),
      placeholder('/tu-vung', 'Từ vựng', 'Tra cứu, lọc và tìm kiếm mọi từ đã có trên website.'),
      placeholder('/tu-vung/:wordId', 'Chi tiết từ', 'Nét viết, mẹo nhớ và các câu ví dụ của một từ.'),
      placeholder('/luyen-tap', 'Luyện tập', 'Năm trò chơi và Thử thách tuần giúp nhớ từ lâu hơn.'),
      placeholder('/luyen-tap/:game', 'Trò chơi luyện tập', 'Trò chơi này đang được làm.'),
      placeholder('/toi', 'Tôi', 'Mục tiêu, lịch nhắc học, huy hiệu và sao lưu tiến độ.'),
      placeholder(
        '/cai-dat-app',
        'Cài website lên điện thoại',
        'Hướng dẫn thêm website vào màn hình chính trên iPhone và Android.',
      ),
      placeholder('/gioi-thieu', 'Giới thiệu', 'Nguồn dữ liệu, giấy phép và quyền riêng tư.'),

      {
        path: '*',
        lazy: async () => ({ Component: (await import('../pages/NotFoundPage.tsx')).default }),
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
